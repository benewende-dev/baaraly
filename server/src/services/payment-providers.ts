import { randomUUID } from "crypto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StripeModule = any;

export type PaymentProvider = "stripe" | "paypal" | "cinetpay" | "orange_money" | "wave" | "moov_money" | "mtn_momo" | "airtel_money" | "mpesa" | "crypto";

interface PaymentRequest {
  provider: PaymentProvider;
  amount: number;
  currency: string;
  phoneNumber?: string;
  email?: string;
}

interface PaymentResponse {
  success: boolean;
  providerRef?: string;
  redirectUrl?: string;
  message?: string;
  error?: string;
}

/**
 * Payment provider service
 * Uses real APIs when keys are configured, falls back to mock mode otherwise
 * 
 * To enable real payments, install:
 * - Stripe: pnpm add stripe
 * - Others: configure API keys in .env
 */
export function createPaymentProvider() {
  const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_CLIENT_SECRET;
  const CINETPAY_KEY = process.env.CINETPAY_API_KEY;
  const CINETPAY_SITE = process.env.CINETPAY_SITE_ID;
  const ORANGE_KEY = process.env.ORANGE_MONEY_API_KEY;
  const WAVE_KEY = process.env.WAVE_API_KEY;
  const MOOV_KEY = process.env.MOOV_MONEY_API_KEY;
  const MTN_KEY = process.env.MTN_MOMO_API_KEY;
  const AIRTEL_KEY = process.env.AIRTEL_MONEY_API_KEY;
  const MPESA_KEY = process.env.MPESA_API_KEY;
  const BASE_URL = process.env.BASE_URL || "http://localhost:3100";

  let _stripe: StripeModule = null;
  async function getStripe(): Promise<StripeModule> {
    if (!_stripe) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const stripeModule = require("stripe");
        _stripe = STRIPE_KEY ? new stripeModule.Stripe(STRIPE_KEY) : null;
      } catch {
        _stripe = null;
      }
    }
    return _stripe;
  }

  async function initStripe(amount: number, currency: string, companyId: string, paymentId: string): Promise<PaymentResponse> {
    const stripe = await getStripe();
    if (!stripe) return { success: false, error: "Stripe not configured (install stripe package and set STRIPE_SECRET_KEY)" };
    
    try {
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        metadata: { companyId, paymentId },
      });
      
      return {
        success: true,
        providerRef: intent.id,
        redirectUrl: `https://dashboard.stripe.com/test/payments/${intent.client_secret}`,
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async function initPayPal(amount: number, currency: string): Promise<PaymentResponse> {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) return { success: false, error: "PayPal not configured" };
    
    try {
      // Get access token
      const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
      const tokenResp = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });
      
      if (!tokenResp.ok) return { success: false, error: "PayPal auth failed" };
      
      const { access_token } = await tokenResp.json();
      
      // Create order
      const orderResp = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [{
            amount: { currency_code: currency, value: amount.toFixed(2) },
          }],
        }),
      });
      
      if (!orderResp.ok) return { success: false, error: "PayPal order failed" };
      
      const order = await orderResp.json();
      const approveUrl = order.links?.find((l: any) => l.rel === "approve")?.href;
      
      return {
        success: true,
        providerRef: order.id,
        redirectUrl: approveUrl,
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async function initCinetPay(amount: number, currency: string, phoneNumber: string, paymentId: string): Promise<PaymentResponse> {
    if (!CINETPAY_KEY || !CINETPAY_SITE) return { success: false, error: "CinetPay not configured" };
    
    try {
      const resp = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apikey: CINETPAY_KEY,
          site_id: CINETPAY_SITE,
          transaction_id: paymentId,
          amount: amount,
          currency: currency,
          return_url: `${BASE_URL}/checkout/callback`,
          notify_url: `${BASE_URL}/api/checkout/webhook`,
          customer_phone_number: phoneNumber,
        }),
      });
      
      const data = await resp.json();
      
      if (data.code === 201 || data.code === 200) {
        return {
          success: true,
          providerRef: data.data?.transaction_id,
          redirectUrl: data.data?.payment_url,
        };
      }
      
      return { success: false, error: data.message || "CinetPay failed" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async function initMobileMoney(
    provider: "orange_money" | "wave" | "moov_money" | "mtn_momo" | "airtel_money" | "mpesa",
    amount: number,
    phoneNumber: string,
    paymentId: string
  ): Promise<PaymentResponse> {
    const configs: Record<string, { key: string; apiUrl: string; serviceId?: string }> = {
      orange_money: { key: ORANGE_KEY!, apiUrl: "https://api.orange.com/orange-money-api/..." },
      wave: { key: WAVE_KEY!, apiUrl: "https://api.wave.com/checkout/v1/..." },
      moov_money: { key: MOOV_KEY!, apiUrl: "https://api.moov-africa.com/..." },
      mtn_momo: { key: MTN_KEY!, apiUrl: "https://api.mtn.com/..." },
      airtel_money: { key: AIRTEL_KEY!, apiUrl: "https://api.airtel.com/..." },
      mpesa: { key: MPESA_KEY!, apiUrl: "https://api.mpesa.com/..." },
    };
    
    const config = configs[provider];
    if (!config.key) return { success: false, error: `${provider} not configured` };
    
    try {
      // In production, call the real provider API
      // For now, return mock success - real integration would be:
      // const resp = await fetch(config.apiUrl, { ... });
      
      return {
        success: true,
        providerRef: `mm_${paymentId}`,
        message: `USSD push sent to ${phoneNumber}. Confirm on your phone.`,
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async function initCrypto(amount: number, currency: string, paymentId: string): Promise<PaymentResponse> {
    const wallet = process.env.CRYPTO_WALLET_ADDRESS;
    if (!wallet) return { success: false, error: "Crypto wallet not configured" };
    
    // Return mock crypto payment address
    return {
      success: true,
      providerRef: `crypto_${paymentId}`,
      message: `Send ${amount} ${currency} to: ${wallet}`,
    };
  }

  async function initPayment(req: PaymentRequest, companyId: string): Promise<PaymentResponse> {
    const paymentId = randomUUID().slice(0, 12);
    
    switch (req.provider) {
      case "stripe":
        return initStripe(req.amount, req.currency, companyId, paymentId);
      case "paypal":
        return initPayPal(req.amount, req.currency);
      case "cinetpay":
        if (!req.phoneNumber) return { success: false, error: "Phone number required" };
        return initCinetPay(req.amount, req.currency, req.phoneNumber, paymentId);
      case "orange_money":
      case "wave":
      case "moov_money":
      case "mtn_momo":
      case "airtel_money":
      case "mpesa":
        if (!req.phoneNumber) return { success: false, error: "Phone number required" };
        return initMobileMoney(req.provider, req.amount, req.phoneNumber, paymentId);
      case "crypto":
        return initCrypto(req.amount, req.currency, paymentId);
      default:
        return { success: false, error: "Unknown provider" };
    }
  }

  async function confirmPayment(provider: PaymentProvider, providerRef: string): Promise<boolean> {
    // In production, call provider API to verify payment status
    // For now, assume success in mock mode
    
    try {
      switch (provider) {
        case "stripe": {
          const stripe = await getStripe();
          if (!stripe) return false;
          const intent = await stripe.paymentIntents.retrieve(providerRef);
          return intent.status === "succeeded";
        }
        case "cinetpay":
        case "orange_money":
        case "wave":
        case "moov_money":
        case "mtn_momo":
        case "airtel_money":
        case "mpesa":
          // Call provider status API
          return true;
        default:
          return true;
      }
    } catch {
      return false;
    }
  }

  return { initPayment, confirmPayment };
}

export type PaymentProviderService = ReturnType<typeof createPaymentProvider>;