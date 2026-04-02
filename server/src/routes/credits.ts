import { Router } from "express";
import type { Db } from "@paperclipai/db";
import { creditService } from "../services/credits.js";
import { assertCompanyAccess } from "./authz.js";

/**
 * Payment statuses
 */
type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";

interface PaymentRecord {
  id: string;
  companyId: string;
  planId: string;
  provider: string;
  amount: number;
  currency: string;
  credits: number;
  status: PaymentStatus;
  providerRef: string | null;
  createdAt: Date;
  completedAt: Date | null;
}

/** In-memory payment store (replace with DB table later) */
const payments = new Map<string, PaymentRecord>();

export function creditRoutes(db: Db) {
  const router = Router();
  const svc = creditService(db);

  /* ── Get balance ── */
  router.get("/companies/:companyId/credits", async (req, res) => {
    const companyId = req.params.companyId as string;
    assertCompanyAccess(req, companyId);
    const balance = await svc.getBalance(companyId);
    res.json(balance);
  });

  /* ── List transactions ── */
  router.get("/companies/:companyId/credits/transactions", async (req, res) => {
    const companyId = req.params.companyId as string;
    assertCompanyAccess(req, companyId);
    const transactions = await svc.listTransactions(companyId);
    res.json(transactions);
  });

  /* ── Checkout: create payment intent ── */
  router.post("/companies/:companyId/checkout", async (req, res) => {
    const companyId = req.params.companyId as string;
    assertCompanyAccess(req, companyId);
    const { planId, provider, amount, currency, credits, phoneNumber, cardLast4 } = req.body as {
      planId: string;
      provider: string;
      amount: number;
      currency: string;
      credits: number;
      phoneNumber?: string;
      cardLast4?: string;
    };

    if (!planId || !provider || !amount || !credits) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const paymentId = crypto.randomUUID();
    const payment: PaymentRecord = {
      id: paymentId,
      companyId,
      planId,
      provider,
      amount,
      currency: currency || "XOF",
      credits,
      status: "pending",
      providerRef: null,
      createdAt: new Date(),
      completedAt: null,
    };

    payments.set(paymentId, payment);

    /* ── Provider-specific payment initiation ── */
    // TODO: Replace with real provider SDK calls
    // Stripe: create PaymentIntent
    // CinetPay: POST /v2/payment
    // Orange/Wave/Moov: initiate USSD push

    if (provider === "stripe") {
      // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      // const intent = await stripe.paymentIntents.create({
      //   amount: Math.round(amount * 100), // cents
      //   currency: currency.toLowerCase(),
      //   metadata: { companyId, paymentId },
      // });
      // payment.providerRef = intent.id;
    } else if (provider === "cinetpay") {
      // const resp = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     apikey: process.env.CINETPAY_API_KEY,
      //     site_id: process.env.CINETPAY_SITE_ID,
      //     transaction_id: paymentId,
      //     amount,
      //     currency,
      //     return_url: `${process.env.BASE_URL}/checkout/callback`,
      //     notify_url: `${process.env.BASE_URL}/api/checkout/webhook`,
      //     customer_phone_number: phoneNumber,
      //   }),
      // });
      // const data = await resp.json();
      // payment.providerRef = data.data?.transaction_id;
    } else {
      // Mobile money: simulate USSD push notification
      // In production: call provider API to initiate payment
    }

    payment.status = "processing";
    payments.set(paymentId, payment);

    res.json({
      paymentId,
      status: payment.status,
      provider: payment.provider,
      amount: payment.amount,
      currency: payment.currency,
      // In production: return redirect URL or client secret
      message: provider.includes("money") || provider === "orange_money" || provider === "wave" || provider === "moov_money" || provider === "mtn_momo" || provider === "airtel_money" || provider === "mpesa"
        ? `USSD push sent to ${phoneNumber}. Confirm on your phone.`
        : provider === "stripe"
          ? "Card payment ready"
          : "Payment initiated",
    });
  });

  /* ── Confirm payment (called by provider webhook or manually for dev) ── */
  router.post("/companies/:companyId/checkout/:paymentId/confirm", async (req, res) => {
    const { paymentId } = req.params as { paymentId: string };
    const payment = payments.get(paymentId);

    if (!payment) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }

    if (payment.status === "completed") {
      res.json({ status: "completed", balance: (await svc.getBalance(payment.companyId)).balance });
      return;
    }

    // Credit the account
    const result = await svc.addCredits(
      payment.companyId,
      payment.credits,
      `Checkout ${payment.planId}: ${payment.amount} ${payment.currency} via ${payment.provider}`,
    );

    payment.status = "completed";
    payment.completedAt = new Date();
    payments.set(paymentId, payment);

    res.json({ status: "completed", balance: result.balance });
  });

  /* ── Webhook from payment providers ── */
  router.post("/checkout/webhook", async (req, res) => {
    // TODO: Verify webhook signature per provider
    // Stripe: verify Stripe-Signature header
    // CinetPay: verify cpm_signature

    const { transaction_id, status, provider } = req.body as {
      transaction_id: string;
      status: string;
      provider: string;
    };

    const payment = payments.get(transaction_id);
    if (!payment) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }

    if (status === "completed" || status === "success") {
      const result = await svc.addCredits(
        payment.companyId,
        payment.credits,
        `Webhook ${payment.planId}: ${payment.amount} ${payment.currency}`,
      );
      payment.status = "completed";
      payment.completedAt = new Date();
      payments.set(transaction_id, payment);
      res.json({ ok: true, balance: result.balance });
    } else {
      payment.status = "failed";
      payments.set(transaction_id, payment);
      res.json({ ok: true, status: "failed" });
    }
  });

  /* ── Get payment status ── */
  router.get("/companies/:companyId/checkout/:paymentId", async (req, res) => {
    const { paymentId } = req.params as { paymentId: string };
    const payment = payments.get(paymentId);
    if (!payment) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }
    res.json(payment);
  });

  /* ── Legacy recharge (dev only) ── */
  router.post("/companies/:companyId/credits/recharge", async (req, res) => {
    const companyId = req.params.companyId as string;
    assertCompanyAccess(req, companyId);
    const { credits, description } = req.body as { credits: number; description: string };
    if (!credits) {
      res.status(400).json({ error: "Missing credits amount" });
      return;
    }
    const result = await svc.addCredits(companyId, credits, description || "Manual recharge");
    res.json(result);
  });

  /* ── Deduct credits ── */
  router.post("/companies/:companyId/credits/deduct", async (req, res) => {
    const companyId = req.params.companyId as string;
    assertCompanyAccess(req, companyId);
    const { amount, description } = req.body as { amount: number; description: string };
    if (!amount || !description) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const result = await svc.deductCredits(companyId, amount, description);
    if (!result.success) {
      res.status(402).json({ error: "Insufficient credits", balance: result.balance, needed: result.needed });
      return;
    }
    res.json(result);
  });

  return router;
}
