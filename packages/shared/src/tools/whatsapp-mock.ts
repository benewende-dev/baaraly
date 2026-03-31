// Simule l'envoi d'un message WhatsApp
// Benewende Group SARL — infrastructure tech souveraine africaine

export interface WhatsAppMessage {
  to: string;
  message: string;
  type: "text" | "invoice" | "reminder";
}

export interface WhatsAppResult {
  success: boolean;
  messageId: string;
  timestamp: string;
  to: string;
  type: string;
}

let messageCounter = 0;

export function sendWhatsAppMessage(msg: WhatsAppMessage): WhatsAppResult {
  messageCounter++;
  const messageId = `wa_mock_${Date.now()}_${messageCounter}`;

  console.log(`[WhatsApp Mock] Envoi ${msg.type} → ${msg.to}: ${msg.message.slice(0, 80)}...`);

  return {
    success: true,
    messageId,
    timestamp: new Date().toISOString(),
    to: msg.to,
    type: msg.type,
  };
}
