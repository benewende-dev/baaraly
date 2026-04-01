import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface WhatsAppConnectProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhatsAppConnect({ open, onOpenChange }: WhatsAppConnectProps) {
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"input" | "confirm" | "connected">("input");

  function handleSubmit() {
    if (phone.trim().length >= 8) {
      setStep("confirm");
    }
  }

  function handleConfirm() {
    setStep("connected");
  }

  function handleClose() {
    onOpenChange(false);
    setTimeout(() => {
      setStep("input");
      setPhone("");
    }, 300);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{"\uD83D\uDCF1"}</span>
            {t("Connecter WhatsApp")}
          </DialogTitle>
          <DialogDescription>
            {step === "connected"
              ? t("Ton num\u00e9ro est connect\u00e9 !")
              : t("Re\u00e7ois les notifications de tes agents sur WhatsApp")}
          </DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                {t("Num\u00e9ro WhatsApp")}
              </label>
              <div className="flex gap-2">
                <span className="inline-flex items-center rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground">
                  +226
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="70 00 00 00"
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={phone.trim().length < 8}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ backgroundColor: "#25D366" }}
            >
              {t("Continuer")}
            </button>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4 mt-2 text-center">
            <p className="text-sm text-muted-foreground">
              {t("Confirmer le num\u00e9ro")} :
            </p>
            <p className="text-lg font-bold">+226 {phone}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setStep("input")}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border border-border transition-all hover:bg-accent"
              >
                {t("Modifier")}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ backgroundColor: "#25D366" }}
              >
                {t("Confirmer")}
              </button>
            </div>
          </div>
        )}

        {step === "connected" && (
          <div className="space-y-4 mt-2 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <span className="text-3xl">{"\u2705"}</span>
            </div>
            <p className="text-sm font-semibold text-green-600">
              WhatsApp {t("connect\u00e9")}
            </p>
            <p className="text-xs text-muted-foreground">
              +226 {phone}
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ backgroundColor: "#25D366" }}
            >
              {t("Fermer")}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Simple button to trigger WhatsApp connect flow.
 */
export function WhatsAppConnectButton() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-all hover:shadow-md hover:border-green-500/30 active:scale-[0.98]"
      >
        <span className="text-lg">{"\uD83D\uDCF1"}</span>
        {t("Connecter WhatsApp")}
      </button>
      <WhatsAppConnect open={open} onOpenChange={setOpen} />
    </>
  );
}
