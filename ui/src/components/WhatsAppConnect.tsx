import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

const COUNTRIES = [
  // Europe francophone
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+32", flag: "🇧🇪", name: "Belgique" },
  { code: "+41", flag: "🇨🇭", name: "Suisse" },
  { code: "+352", flag: "🇱🇺", name: "Luxembourg" },
  { code: "+377", flag: "🇲🇨", name: "Monaco" },
  // Afrique de l'Ouest
  { code: "+226", flag: "🇧🇫", name: "Burkina Faso" },
  { code: "+229", flag: "🇧🇯", name: "Bénin" },
  { code: "+223", flag: "🇲🇱", name: "Mali" },
  { code: "+221", flag: "🇸🇳", name: "Sénégal" },
  { code: "+225", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "+227", flag: "🇳🇪", name: "Niger" },
  { code: "+228", flag: "🇹🇬", name: "Togo" },
  { code: "+224", flag: "🇬🇳", name: "Guinée" },
  { code: "+245", flag: "🇬🇼", name: "Guinée-Bissau" },
  // Afrique Centrale
  { code: "+237", flag: "🇨🇲", name: "Cameroun" },
  { code: "+241", flag: "🇬🇦", name: "Gabon" },
  { code: "+235", flag: "🇹🇩", name: "Tchad" },
  { code: "+236", flag: "🇨🇫", name: "Centrafrique" },
  { code: "+240", flag: "🇬🇶", name: "Guinée Équatoriale" },
  { code: "+243", flag: "🇨🇩", name: "RD Congo" },
  { code: "+242", flag: "🇨🇬", name: "Congo" },
  // Afrique de l'Est & autres
  { code: "+230", flag: "🇲🇺", name: "Maurice" },
  { code: "+222", flag: "🇲🇷", name: "Mauritanie" },
  { code: "+233", flag: "🇬🇭", name: "Ghana" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
];

interface WhatsAppConnectProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhatsAppConnect({ open, onOpenChange }: WhatsAppConnectProps) {
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"input" | "confirm" | "connected">("input");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

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
      setSelectedCountry(COUNTRIES[0]);
      setShowCountryPicker(false);
    }, 300);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{"📱"}</span>
            {t("Connecter WhatsApp")}
          </DialogTitle>
          <DialogDescription>
            {step === "connected"
              ? t("Ton numéro est connecté !")
              : t("Reçois les notifications de tes agents sur WhatsApp")}
          </DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                {t("Numéro WhatsApp")}
              </label>
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryPicker(!showCountryPicker)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground hover:bg-accent transition-colors"
                  >
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.code}</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  {showCountryPicker && (
                    <div className="absolute top-full left-0 mt-1 z-50 w-64 max-h-64 overflow-y-auto rounded-xl border border-border bg-popover shadow-lg">
                      {COUNTRIES.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setShowCountryPicker(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent ${
                            selectedCountry.code === c.code
                              ? "bg-accent font-medium"
                              : ""
                          }`}
                        >
                          <span className="text-lg">{c.flag}</span>
                          <span className="flex-1">{c.name}</span>
                          <span className="text-muted-foreground">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
              {t("Confirmer le numéro")} :
            </p>
            <p className="text-lg font-bold">{selectedCountry.code} {phone}</p>
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
              <span className="text-3xl">{"✅"}</span>
            </div>
            <p className="text-sm font-semibold text-green-600">
              WhatsApp {t("connecté")}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedCountry.code} {phone}
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
        <span className="text-lg">{"📱"}</span>
        {t("Connecter WhatsApp")}
      </button>
      <WhatsAppConnect open={open} onOpenChange={setOpen} />
    </>
  );
}
