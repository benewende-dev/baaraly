/**
 * WhatsApp Provider abstraction.
 * Swap between Mock (dev), Twilio, or Meta Cloud API without changing business logic.
 */

export interface WhatsAppProvider {
  /**
   * Send an OTP code to verify a phone number.
   * Returns { success, sid? } for tracking.
   */
  sendOtp(to: string): Promise<{ success: boolean; sid?: string }>;

  /**
   * Verify an OTP code sent to a phone number.
   */
  verifyOtp(to: string, code: string): Promise<{ valid: boolean }>;

  /**
   * Send a WhatsApp text message.
   */
  sendMessage(to: string, body: string): Promise<{ success: boolean; sid?: string }>;

  /**
   * Send a WhatsApp template message (required for marketing/initiated convos).
   */
  sendTemplate(
    to: string,
    templateName: string,
    language: string,
    components?: Array<Record<string, unknown>>,
  ): Promise<{ success: boolean; sid?: string }>;

  /**
   * Health check — is the provider configured and reachable?
   */
  health(): Promise<{ ok: boolean; provider: string }>;
}

export type WhatsAppProviderName = "mock" | "twilio" | "meta";

export interface WhatsAppProviderConfig {
  provider: WhatsAppProviderName;
  /** Twilio Account SID */
  accountSid?: string;
  /** Twilio Auth Token */
  authToken?: string;
  /** Twilio WhatsApp-enabled phone number (e.g. "whatsapp:+14155238886") */
  fromNumber?: string;
  /** Meta Cloud API access token */
  metaAccessToken?: string;
  /** Meta Cloud API phone number ID */
  metaPhoneNumberId?: string;
  /** Meta Cloud API WhatsApp Business Account ID */
  metaWabaId?: string;
}

/**
 * Create the configured WhatsApp provider.
 * Falls back to Mock if no real provider is configured.
 */
export async function createWhatsAppProvider(
  config: WhatsAppProviderConfig,
): Promise<WhatsAppProvider> {
  switch (config.provider) {
    case "twilio":
      if (!config.accountSid || !config.authToken || !config.fromNumber) {
        console.warn("[WhatsApp] Twilio configured but missing credentials, falling back to mock");
        return createMockProvider();
      }
      return createTwilioProvider(config);
    case "meta":
      if (!config.metaAccessToken || !config.metaPhoneNumberId) {
        console.warn("[WhatsApp] Meta configured but missing credentials, falling back to mock");
        return createMockProvider();
      }
      return createMetaProvider(config);
    default:
      return createMockProvider();
  }
}

/* ── Mock Provider (dev / no API) ── */

function createMockProvider(): WhatsAppProvider {
  const otpStore = new Map<string, string>();

  return {
    async sendOtp(to: string) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(to, code);
      console.log(`[WhatsApp Mock] OTP for ${to}: ${code}`);
      return { success: true, sid: `mock-otp-${Date.now()}` };
    },
    async verifyOtp(to: string, code: string) {
      const stored = otpStore.get(to);
      return { valid: stored === code };
    },
    async sendMessage(to: string, body: string) {
      console.log(`[WhatsApp Mock] Message to ${to}: ${body}`);
      return { success: true, sid: `mock-msg-${Date.now()}` };
    },
    async sendTemplate(to, templateName, language) {
      console.log(`[WhatsApp Mock] Template "${templateName}" (${language}) to ${to}`);
      return { success: true, sid: `mock-tpl-${Date.now()}` };
    },
    async health() {
      return { ok: true, provider: "mock" };
    },
  };
}

/* ── Twilio Provider ── */

function createTwilioProvider(config: WhatsAppProviderConfig): WhatsAppProvider {
  // Lazy import so we don't crash if twilio isn't installed yet
  let client: any;

  function getClient() {
    if (!client) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const twilio = require("twilio");
      client = twilio(config.accountSid, config.authToken);
    }
    return client;
  }

  return {
    async sendOtp(to: string) {
      try {
        const service = await getClient().verify.v2.services.create({
          friendlyName: "Baaraly OTP",
        });
        const verification = await getClient().verify.v2
          .services(service.sid)
          .verifications.create({ to: `whatsapp:${to}`, channel: "sms" });
        return { success: verification.status === "pending", sid: verification.sid };
      } catch (err) {
        console.error("[WhatsApp Twilio] sendOtp failed:", err);
        return { success: false };
      }
    },
    async verifyOtp(to: string, code: string) {
      try {
        // In production, you'd store the service SID. For now, list and check.
        const services = await getClient().verify.v2.services.list({ limit: 10 });
        const baaralyService = services.find(
          (s: any) => s.friendlyName === "Baaraly OTP",
        );
        if (!baaralyService) return { valid: false };
        const check = await getClient().verify.v2
          .services(baaralyService.sid)
          .verificationChecks.create({ to: `whatsapp:${to}`, code });
        return { valid: check.status === "approved" };
      } catch (err) {
        console.error("[WhatsApp Twilio] verifyOtp failed:", err);
        return { valid: false };
      }
    },
    async sendMessage(to: string, body: string) {
      try {
        const msg = await getClient().messages.create({
          from: config.fromNumber,
          to: `whatsapp:${to}`,
          body,
        });
        return { success: true, sid: msg.sid };
      } catch (err) {
        console.error("[WhatsApp Twilio] sendMessage failed:", err);
        return { success: false };
      }
    },
    async sendTemplate(to, templateName, language, components) {
      try {
        // Twilio Content Templates via MessagingService or direct
        const msg = await getClient().messages.create({
          from: config.fromNumber,
          to: `whatsapp:${to}`,
          contentSid: templateName, // or use contentTemplateSid
        });
        return { success: true, sid: msg.sid };
      } catch (err) {
        console.error("[WhatsApp Twilio] sendTemplate failed:", err);
        return { success: false };
      }
    },
    async health() {
      try {
        await getClient().accounts(config.accountSid!).fetch();
        return { ok: true, provider: "twilio" };
      } catch {
        return { ok: false, provider: "twilio" };
      }
    },
  };
}

/* ── Meta Cloud API Provider ── */

function createMetaProvider(config: WhatsAppProviderConfig): WhatsAppProvider {
  const baseUrl = "https://graph.facebook.com/v18.0";

  async function post(path: string, body: Record<string, unknown>) {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.metaAccessToken}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`[WhatsApp Meta] POST ${path} failed: ${err}`);
      return null;
    }
    return res.json();
  }

  return {
    async sendOtp(to: string) {
      // Meta doesn't have a built-in OTP service — you'd use a template
      // For now, generate a code and send via template
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      try {
        await post(`/${config.metaPhoneNumberId}/messages`, {
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: "verification_code",
            language: { code: "fr" },
            components: [
              { type: "body", parameters: [{ type: "text", text: code }] },
            ],
          },
        });
        return { success: true, sid: `meta-otp-${Date.now()}` };
      } catch {
        return { success: false };
      }
    },
    async verifyOtp(_to: string, _code: string) {
      // Meta doesn't verify OTPs — you'd track codes yourself
      // This would need a code store (Redis/DB)
      return { valid: false };
    },
    async sendMessage(to: string, body: string) {
      try {
        const result = await post(`/${config.metaPhoneNumberId}/messages`, {
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body },
        });
        return { success: !!result, sid: result?.messages?.[0]?.id };
      } catch {
        return { success: false };
      }
    },
    async sendTemplate(to, templateName, language, components) {
      try {
        const result = await post(`/${config.metaPhoneNumberId}/messages`, {
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: templateName,
            language: { code: language },
            components: components || [],
          },
        });
        return { success: !!result, sid: result?.messages?.[0]?.id };
      } catch {
        return { success: false };
      }
    },
    async health() {
      try {
        const res = await fetch(`${baseUrl}/${config.metaPhoneNumberId}`, {
          headers: { Authorization: `Bearer ${config.metaAccessToken}` },
        });
        return { ok: res.ok, provider: "meta" };
      } catch {
        return { ok: false, provider: "meta" };
      }
    },
  };
}
