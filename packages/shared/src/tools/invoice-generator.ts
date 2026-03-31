// G\u00e9n\u00e9rateur de factures simples en FCFA
// Benewende Group SARL — infrastructure tech souveraine africaine

import { formatCurrency } from "../currencies.js";

export interface InvoiceItem {
  nom: string;
  quantite: number;
  prix: number;
}

export interface Invoice {
  numero: string;
  date: string;
  client: string;
  items: Array<InvoiceItem & { sousTotal: number; formatted: { prix: string; sousTotal: string } }>;
  totalHT: number;
  tauxTva: number;
  montantTva: number;
  totalTTC: number;
  formatted: {
    totalHT: string;
    tva: string;
    totalTTC: string;
  };
}

let invoiceCounter = 0;

export function generateInvoice(data: {
  client: string;
  items: InvoiceItem[];
  tauxTva?: number;
}): Invoice {
  invoiceCounter++;
  const now = new Date();
  const numero = `FAC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(invoiceCounter).padStart(4, "0")}`;
  const tauxTva = data.tauxTva ?? 0.18;

  const itemsWithTotals = data.items.map((item) => {
    const sousTotal = item.quantite * item.prix;
    return {
      ...item,
      sousTotal,
      formatted: {
        prix: formatCurrency(item.prix, "XOF"),
        sousTotal: formatCurrency(sousTotal, "XOF"),
      },
    };
  });

  const totalHT = itemsWithTotals.reduce((sum, item) => sum + item.sousTotal, 0);
  const montantTva = Math.round(totalHT * tauxTva);
  const totalTTC = totalHT + montantTva;

  return {
    numero,
    date: now.toISOString(),
    client: data.client,
    items: itemsWithTotals,
    totalHT,
    tauxTva,
    montantTva,
    totalTTC,
    formatted: {
      totalHT: formatCurrency(totalHT, "XOF"),
      tva: formatCurrency(montantTva, "XOF"),
      totalTTC: formatCurrency(totalTTC, "XOF"),
    },
  };
}
