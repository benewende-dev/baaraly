// Donn\u00e9es agricoles mock\u00e9es mais r\u00e9alistes pour l'Afrique de l'Ouest
// Benewende Group SARL — infrastructure tech souveraine africaine

import { formatCurrency } from "../currencies.js";

export interface MarketPrice {
  culture: string;
  prixMin: number;
  prixMax: number;
  unite: string;
  formatted: { min: string; max: string };
}

export interface MeteoRegion {
  region: string;
  description: string;
  tempMin: number;
  tempMax: number;
  humidite: string;
}

export interface CalendrierAgricole {
  mois: string;
  zone: string;
  activites: string[];
}

export interface AlertePhytosanitaire {
  culture: string;
  menace: string;
  risque: "faible" | "moyen" | "eleve";
  conseil: string;
}

const MARKET_PRICES_DATA: Omit<MarketPrice, "formatted">[] = [
  { culture: "Mil", prixMin: 150, prixMax: 200, unite: "FCFA/kg" },
  { culture: "Sorgho", prixMin: 130, prixMax: 180, unite: "FCFA/kg" },
  { culture: "Ma\u00efs", prixMin: 150, prixMax: 200, unite: "FCFA/kg" },
  { culture: "Coton graine", prixMin: 260, prixMax: 300, unite: "FCFA/kg" },
  { culture: "S\u00e9same", prixMin: 500, prixMax: 700, unite: "FCFA/kg" },
  { culture: "Anacarde", prixMin: 400, prixMax: 600, unite: "FCFA/kg" },
  { culture: "Cacao", prixMin: 1_000, prixMax: 1_500, unite: "FCFA/kg" },
  { culture: "Riz paddy", prixMin: 200, prixMax: 280, unite: "FCFA/kg" },
  { culture: "Arachide", prixMin: 250, prixMax: 400, unite: "FCFA/kg" },
  { culture: "Ni\u00e9b\u00e9", prixMin: 300, prixMax: 450, unite: "FCFA/kg" },
];

const METEO_REGIONS: MeteoRegion[] = [
  { region: "Sahel Nord", description: "Sec, ciel d\u00e9gag\u00e9", tempMin: 35, tempMax: 42, humidite: "Tr\u00e8s faible (10-20%)" },
  { region: "Sahel Sud", description: "Quelques nuages", tempMin: 28, tempMax: 35, humidite: "Faible (20-35%)" },
  { region: "Zone Soudanienne", description: "Pluies possibles", tempMin: 25, tempMax: 33, humidite: "Moyenne (40-60%)" },
  { region: "Zone Foresti\u00e8re (CI)", description: "Humide, averses", tempMin: 25, tempMax: 30, humidite: "\u00c9lev\u00e9e (70-85%)" },
  { region: "Zone C\u00f4ti\u00e8re (SN)", description: "Brise marine, nuageux", tempMin: 22, tempMax: 28, humidite: "\u00c9lev\u00e9e (65-80%)" },
];

const CALENDRIER_DATA: CalendrierAgricole[] = [
  { mois: "Janvier-F\u00e9vrier", zone: "Sahel", activites: ["Pr\u00e9paration des sols", "Achat des semences", "Compostage"] },
  { mois: "Mars-Avril", zone: "Sahel", activites: ["Labour", "Traitement phytosanitaire pr\u00e9ventif", "Pr\u00e9paration p\u00e9pini\u00e8res"] },
  { mois: "Mai-Juin", zone: "Sahel", activites: ["Semis mil et sorgho", "Semis ma\u00efs (zone sud)", "Premier sarclage"] },
  { mois: "Juillet-Ao\u00fbt", zone: "Sahel", activites: ["Deuxi\u00e8me sarclage", "Apport engrais", "Surveillance parasites"] },
  { mois: "Septembre-Octobre", zone: "Sahel", activites: ["R\u00e9colte mil pr\u00e9coce", "R\u00e9colte arachide", "S\u00e9chage"] },
  { mois: "Novembre-D\u00e9cembre", zone: "Sahel", activites: ["R\u00e9colte coton", "Battage c\u00e9r\u00e9ales", "Stockage et vente"] },
  { mois: "Mars-Avril", zone: "Zone Foresti\u00e8re", activites: ["Semis cacao", "Entretien plantations", "Traitement cacaoy\u00e8res"] },
  { mois: "Octobre-D\u00e9cembre", zone: "Zone Foresti\u00e8re", activites: ["R\u00e9colte cacao (campagne principale)", "Fermentation", "S\u00e9chage"] },
];

const ALERTES_DATA: AlertePhytosanitaire[] = [
  { culture: "Mil", menace: "Chenille l\u00e9gionnaire d\u2019automne", risque: "eleve", conseil: "Traitement biologique avec Bt ou neem. Surveillance r\u00e9guli\u00e8re des parcelles." },
  { culture: "Ma\u00efs", menace: "Foreur de tige", risque: "moyen", conseil: "Rotation des cultures. Destruction des r\u00e9sidus apr\u00e8s r\u00e9colte." },
  { culture: "Coton", menace: "Pucerons", risque: "moyen", conseil: "Traitement avec insecticide homologu\u00e9. Favoriser les auxiliaires naturels." },
  { culture: "Arachide", menace: "Aflatoxines (stockage)", risque: "eleve", conseil: "S\u00e9chage complet avant stockage. Stocker dans un endroit sec et ventil\u00e9." },
  { culture: "Tomate", menace: "Tuta absoluta", risque: "eleve", conseil: "Pi\u00e8ges \u00e0 ph\u00e9romones. Filets anti-insectes sur les p\u00e9pini\u00e8res." },
];

function randomInRange(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

export function getMarketPrices(): MarketPrice[] {
  return MARKET_PRICES_DATA.map((p) => {
    const prix = randomInRange(p.prixMin, p.prixMax);
    return {
      ...p,
      prixMin: Math.max(p.prixMin, prix - 20),
      prixMax: Math.min(p.prixMax, prix + 20),
      formatted: {
        min: formatCurrency(Math.max(p.prixMin, prix - 20), "XOF"),
        max: formatCurrency(Math.min(p.prixMax, prix + 20), "XOF"),
      },
    };
  });
}

export function getMeteo(): MeteoRegion[] {
  return METEO_REGIONS;
}

export function getCalendrierAgricole(zone?: string): CalendrierAgricole[] {
  if (zone) {
    return CALENDRIER_DATA.filter((c) => c.zone.toLowerCase().includes(zone.toLowerCase()));
  }
  return CALENDRIER_DATA;
}

export function getAlertesPhytosanitaires(culture?: string): AlertePhytosanitaire[] {
  if (culture) {
    return ALERTES_DATA.filter((a) => a.culture.toLowerCase().includes(culture.toLowerCase()));
  }
  return ALERTES_DATA;
}

export function calculerRentabiliteParcelle(data: {
  superficie: number;
  culture: string;
  rendementKgHa: number;
  prixVenteKg: number;
  coutIntrantsHa: number;
  coutMainOeuvreHa: number;
}): {
  production: number;
  recettes: number;
  couts: number;
  benefice: number;
  rentabilitePercent: number;
  formatted: Record<string, string>;
} {
  const production = data.superficie * data.rendementKgHa;
  const recettes = production * data.prixVenteKg;
  const couts = data.superficie * (data.coutIntrantsHa + data.coutMainOeuvreHa);
  const benefice = recettes - couts;
  const rentabilitePercent = couts > 0 ? Math.round((benefice / couts) * 100) : 0;
  return {
    production,
    recettes,
    couts,
    benefice,
    rentabilitePercent,
    formatted: {
      production: `${production.toLocaleString("fr-FR")} kg`,
      recettes: formatCurrency(recettes, "XOF"),
      couts: formatCurrency(couts, "XOF"),
      benefice: formatCurrency(benefice, "XOF"),
      rentabilite: `${rentabilitePercent}%`,
    },
  };
}
