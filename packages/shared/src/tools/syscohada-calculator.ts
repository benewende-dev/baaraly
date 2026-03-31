// Calculateur SYSCOHADA — TVA, IS, classification comptable OHADA
// Benewende Group SARL — infrastructure tech souveraine africaine

import { formatCurrency } from "../currencies.js";

export interface TvaResult {
  montantHT: number;
  tauxTva: number;
  montantTva: number;
  montantTTC: number;
  formatted: { ht: string; tva: string; ttc: string };
}

export interface IsResult {
  beneficeImposable: number;
  tauxIs: number;
  montantIs: number;
  beneficeNet: number;
  formatted: { imposable: string; is: string; net: string };
}

export interface CompteOhada {
  classe: number;
  numero: string;
  libelle: string;
  nature: "debit" | "credit";
}

export interface BilanSimplifie {
  actif: { immobilisations: number; stocks: number; creances: number; tresorerie: number; total: number };
  passif: { capitaux: number; dettes: number; total: number };
  formatted: Record<string, string>;
}

const TVA_RATES: Record<string, number> = {
  BF: 0.18,
  CI: 0.18,
  SN: 0.18,
  ML: 0.18,
  NE: 0.19,
  TG: 0.18,
  BJ: 0.18,
  CM: 0.1925,
  GA: 0.18,
  CG: 0.185,
  TD: 0.18,
};

const IS_RATES: Record<string, number> = {
  BF: 0.275,
  CI: 0.25,
  SN: 0.30,
  ML: 0.30,
  NE: 0.30,
  TG: 0.27,
  BJ: 0.30,
  CM: 0.33,
};

const PLAN_COMPTABLE: Record<string, CompteOhada> = {
  vente: { classe: 7, numero: "701", libelle: "Ventes de marchandises", nature: "credit" },
  achat_marchandises: { classe: 6, numero: "601", libelle: "Achats de marchandises", nature: "debit" },
  achat_fournitures: { classe: 6, numero: "604", libelle: "Achats de fournitures", nature: "debit" },
  salaire: { classe: 6, numero: "661", libelle: "R\u00e9mun\u00e9rations du personnel", nature: "debit" },
  loyer: { classe: 6, numero: "622", libelle: "Locations et charges locatives", nature: "debit" },
  electricite: { classe: 6, numero: "605", libelle: "Autres achats", nature: "debit" },
  transport: { classe: 6, numero: "612", libelle: "Transports sur achats", nature: "debit" },
  banque_depot: { classe: 5, numero: "521", libelle: "Banques locales", nature: "debit" },
  caisse: { classe: 5, numero: "571", libelle: "Caisse", nature: "debit" },
  client_creance: { classe: 4, numero: "411", libelle: "Clients", nature: "debit" },
  fournisseur_dette: { classe: 4, numero: "401", libelle: "Fournisseurs", nature: "credit" },
  capital: { classe: 1, numero: "101", libelle: "Capital social", nature: "credit" },
  immobilisation: { classe: 2, numero: "241", libelle: "Mat\u00e9riel et outillage", nature: "debit" },
  stock: { classe: 3, numero: "311", libelle: "Marchandises", nature: "debit" },
};

export function calculerTva(montantHT: number, countryCode?: string): TvaResult {
  const taux = TVA_RATES[countryCode ?? "BF"] ?? 0.18;
  const montantTva = Math.round(montantHT * taux);
  const montantTTC = montantHT + montantTva;
  return {
    montantHT,
    tauxTva: taux,
    montantTva,
    montantTTC,
    formatted: {
      ht: formatCurrency(montantHT, "XOF"),
      tva: formatCurrency(montantTva, "XOF"),
      ttc: formatCurrency(montantTTC, "XOF"),
    },
  };
}

export function calculerIs(beneficeImposable: number, countryCode?: string): IsResult {
  const taux = IS_RATES[countryCode ?? "BF"] ?? 0.275;
  const montantIs = Math.round(beneficeImposable * taux);
  const beneficeNet = beneficeImposable - montantIs;
  return {
    beneficeImposable,
    tauxIs: taux,
    montantIs,
    beneficeNet,
    formatted: {
      imposable: formatCurrency(beneficeImposable, "XOF"),
      is: formatCurrency(montantIs, "XOF"),
      net: formatCurrency(beneficeNet, "XOF"),
    },
  };
}

export function classerOperation(type: string): CompteOhada | null {
  return PLAN_COMPTABLE[type] ?? null;
}

export function genererBilanSimplifie(data: {
  immobilisations: number;
  stocks: number;
  creances: number;
  tresorerie: number;
  capitaux: number;
  dettes: number;
}): BilanSimplifie {
  const totalActif = data.immobilisations + data.stocks + data.creances + data.tresorerie;
  const totalPassif = data.capitaux + data.dettes;
  return {
    actif: {
      immobilisations: data.immobilisations,
      stocks: data.stocks,
      creances: data.creances,
      tresorerie: data.tresorerie,
      total: totalActif,
    },
    passif: {
      capitaux: data.capitaux,
      dettes: data.dettes,
      total: totalPassif,
    },
    formatted: {
      immobilisations: formatCurrency(data.immobilisations, "XOF"),
      stocks: formatCurrency(data.stocks, "XOF"),
      creances: formatCurrency(data.creances, "XOF"),
      tresorerie: formatCurrency(data.tresorerie, "XOF"),
      totalActif: formatCurrency(totalActif, "XOF"),
      capitaux: formatCurrency(data.capitaux, "XOF"),
      dettes: formatCurrency(data.dettes, "XOF"),
      totalPassif: formatCurrency(totalPassif, "XOF"),
    },
  };
}

export { PLAN_COMPTABLE, TVA_RATES, IS_RATES };
