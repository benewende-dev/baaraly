import { createDb } from "../client.js";
import { plans } from "../schema/plans.js";
import { eq } from "drizzle-orm";

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("No DATABASE_URL set, skipping seed (PGlite mode)");
  process.exit(0);
}

const db = createDb(url);

const PLANS = [
  {
    name: "gratuit",
    displayName: "Essai Gratuit",
    priceFcfa: 0,
    durationDays: 7,
    maxAgents: 1,
    creditsIncluded: 500,
    features: ["1 agent Standard", "WhatsApp inclus", "Dashboard basique", "Support email"],
    isPublic: true,
    isPopular: false,
    color: "#30D158",
    order: 1,
    isActive: true,
  },
  {
    name: "pro",
    displayName: "Pro",
    priceFcfa: 30000,
    durationDays: null,
    maxAgents: 10,
    creditsIncluded: 5000,
    features: [
      "10 agents (Standard + Avancé)",
      "Multi WhatsApp",
      "Rapports avancés",
      "Support prioritaire",
      "Agents Finance, Commerce, Conformité",
    ],
    isPublic: true,
    isPopular: true,
    color: "#0071E3",
    order: 2,
    isActive: true,
  },
  {
    name: "max",
    displayName: "Max",
    priceFcfa: 95000,
    durationDays: null,
    maxAgents: 999,
    creditsIncluded: 20000,
    features: [
      "Tous les agents disponibles",
      "API access",
      "Multi-entreprise",
      "Support dédié",
      "Agents premium inclus",
    ],
    isPublic: true,
    isPopular: false,
    color: "#BF5AF2",
    order: 3,
    isActive: true,
  },
  {
    name: "trading",
    displayName: "Trading",
    priceFcfa: 95000,
    durationDays: null,
    maxAgents: 5,
    creditsIncluded: 10000,
    features: [
      "5 agents Trading + Crypto",
      "Accès sur invitation uniquement",
      "Support dédié",
    ],
    isPublic: false,
    isPopular: false,
    color: "#FF9F0A",
    order: 4,
    isActive: true,
  },
];

async function seedPlans() {
  console.log("Seeding plans...");

  let created = 0;
  let updated = 0;

  for (const plan of PLANS) {
    const existing = await db.query.plans.findFirst({
      where: eq(plans.name, plan.name),
    });

    if (existing) {
      await db
        .update(plans)
        .set({ ...plan, updatedAt: new Date() })
        .where(eq(plans.id, existing.id));
      updated++;
      console.log(`  Updated: ${plan.displayName}`);
    } else {
      await db.insert(plans).values(plan);
      created++;
      console.log(`  Created: ${plan.displayName}`);
    }
  }

  console.log(`Plans seeded: ${created} created, ${updated} updated`);
}

await seedPlans();
process.exit(0);
