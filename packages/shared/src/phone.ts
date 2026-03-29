// Validation et formatage des numéros de téléphone africains
// Benewende Group SARL — infrastructure tech souveraine africaine

const AFRICAN_COUNTRIES = {
  BF: {
    name: "Burkina Faso",
    dialCode: "+226",
    format: "XX XX XX XX",
    length: 8,
  },
  BJ: {
    name: "Bénin",
    dialCode: "+229",
    format: "XX XX XX XX",
    length: 8,
  },
  CI: {
    name: "Côte d'Ivoire",
    dialCode: "+225",
    format: "XX XX XX XX XX",
    length: 10,
  },
  SN: {
    name: "Sénégal",
    dialCode: "+221",
    format: "XX XXX XX XX",
    length: 9,
  },
  ML: {
    name: "Mali",
    dialCode: "+223",
    format: "XX XX XX XX",
    length: 8,
  },
  NE: {
    name: "Niger",
    dialCode: "+227",
    format: "XX XX XX XX",
    length: 8,
  },
  TG: {
    name: "Togo",
    dialCode: "+228",
    format: "XX XX XX XX",
    length: 8,
  },
  NG: {
    name: "Nigeria",
    dialCode: "+234",
    format: "XXX XXX XXXX",
    length: 10,
  },
  KE: {
    name: "Kenya",
    dialCode: "+254",
    format: "XXX XXX XXX",
    length: 9,
  },
  CD: {
    name: "RDC",
    dialCode: "+243",
    format: "XX XXX XXXX",
    length: 9,
  },
  CM: {
    name: "Cameroun",
    dialCode: "+237",
    format: "X XX XX XX XX",
    length: 9,
  },
  GH: {
    name: "Ghana",
    dialCode: "+233",
    format: "XX XXX XXXX",
    length: 9,
  },
  RW: {
    name: "Rwanda",
    dialCode: "+250",
    format: "XXX XXX XXX",
    length: 9,
  },
} as const;

type CountryCode = keyof typeof AFRICAN_COUNTRIES;

// Nettoyer un numéro (enlever espaces, tirets, parenthèses)
export function cleanPhone(number: string): string {
  return number.replace(/[\s\-().+]/g, "");
}

// Valider un numéro selon le pays
export function validatePhone(number: string, countryCode: string): boolean {
  const country = AFRICAN_COUNTRIES[countryCode as CountryCode];
  if (!country) return false;
  const cleaned = cleanPhone(number);
  // Accepter avec ou sans indicatif
  const dialStripped = country.dialCode.replace("+", "");
  const local = cleaned.startsWith(dialStripped)
    ? cleaned.slice(dialStripped.length)
    : cleaned;
  return local.length === country.length && /^\d+$/.test(local);
}

// Formater un numéro selon le format du pays
export function formatPhone(number: string, countryCode: string): string {
  const country = AFRICAN_COUNTRIES[countryCode as CountryCode];
  if (!country) return number;
  const cleaned = cleanPhone(number);
  const dialStripped = country.dialCode.replace("+", "");
  const local = cleaned.startsWith(dialStripped)
    ? cleaned.slice(dialStripped.length)
    : cleaned;

  let result = "";
  let pos = 0;
  for (const ch of country.format) {
    if (ch === "X") {
      result += local[pos] ?? "";
      pos++;
    } else {
      result += ch;
    }
  }
  return result.trim();
}

// Détecter le pays depuis l'indicatif international
export function detectCountry(number: string): string | null {
  const cleaned = cleanPhone(number);
  for (const [code, country] of Object.entries(AFRICAN_COUNTRIES)) {
    const dial = country.dialCode.replace("+", "");
    if (cleaned.startsWith(dial)) {
      const local = cleaned.slice(dial.length);
      if (local.length === country.length && /^\d+$/.test(local)) {
        return code;
      }
    }
  }
  return null;
}

// Ajouter l'indicatif international
export function toInternationalFormat(number: string, countryCode: string): string {
  const country = AFRICAN_COUNTRIES[countryCode as CountryCode];
  if (!country) return number;
  const cleaned = cleanPhone(number);
  const dialStripped = country.dialCode.replace("+", "");
  const local = cleaned.startsWith(dialStripped)
    ? cleaned.slice(dialStripped.length)
    : cleaned;
  return `${country.dialCode}${local}`;
}

export { AFRICAN_COUNTRIES };
export type { CountryCode };
