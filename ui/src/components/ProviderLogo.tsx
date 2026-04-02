import { type PaymentProvider } from "@paperclipai/shared/baaraly-agents";

interface ProviderLogoProps {
  providerId: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

const LOGOS: Record<string, { svg: string; color: string; name: string }> = {
  orange_money: {
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="24" fill="#FF6600"/>
      <text x="24" y="30" text-anchor="middle" fill="white" font-size="18" font-weight="bold">OM</text>
    </svg>`,
    color: "#FF6600",
    name: "Orange Money"
  },
  wave: {
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#1DC8FF"/>
      <path d="M12 32c4-4 12-8 24-4" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <path d="M12 26c6-4 14-6 24-2" stroke="white" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
      <path d="M12 20c8-4 16-4 24 0" stroke="white" stroke-width="3" stroke-linecap="round" opacity="0.3"/>
    </svg>`,
    color: "#1DC8FF",
    name: "Wave"
  },
  moov_money: {
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#0055A4"/>
      <path d="M24 12v24M12 24h24" stroke="white" stroke-width="4" stroke-linecap="round"/>
      <circle cx="24" cy="24" r="8" stroke="white" stroke-width="3" fill="none"/>
    </svg>`,
    color: "#0055A4",
    name: "Moov Money"
  },
  mtn_momo: {
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#FFC800"/>
      <circle cx="24" cy="24" r="14" fill="#FF8C00"/>
      <text x="24" y="30" text-anchor="middle" fill="white" font-size="14" font-weight="bold">MTN</text>
    </svg>`,
    color: "#FFC800",
    name: "MTN Mobile Money"
  },
  airtel_money: {
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#E4002B"/>
      <circle cx="24" cy="24" r="16" fill="#FFF"/>
      <text x="24" y="29" text-anchor="middle" fill="#E4002B" font-size="16" font-weight="bold">A</text>
    </svg>`,
    color: "#E4002B",
    name: "Airtel Money"
  },
  mpesa: {
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#4CAF50"/>
      <path d="M24 12v24M12 24h24" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <path d="M16 18l8 6 8-6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`,
    color: "#4CAF50",
    name: "M-Pesa"
  },
  cinetpay: {
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#0071E3"/>
      <path d="M14 24h20M14 18h20M14 30h20" stroke="white" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    color: "#0071E3",
    name: "CinetPay"
  },
  stripe: {
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#635BFF"/>
      <path d="M20 20c2-2 4-2 8 0" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M20 28c2-2 4-2 8 0" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M20 16c4-2 8-2 12 2" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M20 32c4 2 8 2 12-2" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    </svg>`,
    color: "#635BFF",
    name: "Stripe"
  },
  paypal: {
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#003087"/>
      <text x="24" y="30" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="Arial">PayPal</text>
    </svg>`,
    color: "#003087",
    name: "PayPal"
  },
  crypto: {
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#F7931A"/>
      <path d="M24 12v24M16 20l8-4 8 4M16 28l8 4 8-4" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`,
    color: "#F7931A",
    name: "Crypto"
  },
};

const SIZE_CLASSES = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
};

export function ProviderLogo({ providerId, size = "md", showName = false }: ProviderLogoProps) {
  const logo = LOGOS[providerId];
  
  if (!logo) {
    return (
      <div className={`${SIZE_CLASSES[size]} rounded-xl bg-muted flex items-center justify-center`}>
        <span className="text-xs font-bold">?</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <div 
        className={`${SIZE_CLASSES[size]} rounded-xl flex items-center justify-center overflow-hidden`}
        dangerouslySetInnerHTML={{ __html: logo.svg }}
      />
      {showName && (
        <span className="text-sm font-semibold">{logo.name}</span>
      )}
    </div>
  );
}

export function ProviderLogoOnly({ providerId, size = "md" }: { providerId: string; size?: "sm" | "md" }) {
  return <ProviderLogo providerId={providerId} size={size} />;
}