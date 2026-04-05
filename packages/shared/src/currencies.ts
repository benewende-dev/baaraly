// Devises africaines et internationales supportées par Baarali
// Benewende Group SARL — infrastructure tech souveraine africaine

const CURRENCIES = {
  XOF: {
    code: "XOF",
    name: "Franc CFA Ouest",
    symbol: "FCFA",
    countries: ["BF", "CI", "SN", "ML", "NE", "TG", "BJ", "GW"],
    decimals: 0,
  },
  XAF: {
    code: "XAF",
    name: "Franc CFA Centre",
    symbol: "FCFA",
    countries: ["CM", "GA", "CG", "CF", "TD", "GQ"],
    decimals: 0,
  },
  NGN: {
    code: "NGN",
    name: "Naira",
    symbol: "₦",
    countries: ["NG"],
    decimals: 2,
  },
  GHS: {
    code: "GHS",
    name: "Cedi",
    symbol: "₵",
    countries: ["GH"],
    decimals: 2,
  },
  KES: {
    code: "KES",
    name: "Shilling Kenyan",
    symbol: "KSh",
    countries: ["KE"],
    decimals: 2,
  },
  CDF: {
    code: "CDF",
    name: "Franc Congolais",
    symbol: "FC",
    countries: ["CD"],
    decimals: 2,
  },
  RWF: {
    code: "RWF",
    name: "Franc Rwandais",
    symbol: "FRw",
    countries: ["RW"],
    decimals: 0,
  },
  USD: {
    code: "USD",
    name: "Dollar américain",
    symbol: "$",
    countries: [],
    decimals: 2,
  },
} as const;

type CurrencyCode = keyof typeof CURRENCIES;

// Formater un montant selon la devise
export function formatCurrency(amount: number, currency: string): string {
  const entry = CURRENCIES[currency as CurrencyCode];
  if (!entry) return `${amount} ${currency}`;
  const rounded = entry.decimals === 0 ? Math.round(amount) : amount;
  const formatted = rounded.toLocaleString("fr-FR", {
    minimumFractionDigits: entry.decimals,
    maximumFractionDigits: entry.decimals,
  });
  return `${formatted} ${entry.symbol}`;
}

// Obtenir le symbole d'une devise
export function getCurrencySymbol(currency: string): string {
  return CURRENCIES[currency as CurrencyCode]?.symbol ?? currency;
}

// Convertir vers USD
export function convertToUSD(amount: number, currency: string, rate: number): number {
  if (currency === "USD") return amount;
  return amount / rate;
}

// Obtenir la devise par pays
export function getCurrencyByCountry(countryCode: string): string {
  for (const [code, entry] of Object.entries(CURRENCIES)) {
    if ((entry.countries as readonly string[]).includes(countryCode)) {
      return code;
    }
  }
  return "USD";
}

// Vérifier si devise supportée
export function isSupportedCurrency(currency: string): boolean {
  return currency in CURRENCIES;
}

export { CURRENCIES };
export type { CurrencyCode };
