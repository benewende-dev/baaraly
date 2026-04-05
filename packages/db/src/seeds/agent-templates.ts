import { createDb } from "../client.js";
import { agentTemplates } from "../schema/agent_templates.js";
import { eq } from "drizzle-orm";
import { BAARALI_AGENTS } from "@paperclipai/shared/baarali-agents";

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("No DATABASE_URL set, skipping seed (PGlite mode — tables created on server start)");
  console.log("To seed manually, set DATABASE_URL and run this script.");
  process.exit(0);
}

const db = createDb(url);

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function isPremiumTier(tier: number): boolean {
  return tier >= 3;
}

function calculatePrice(tier: number): number {
  switch (tier) {
    case 1: return 0;
    case 2: return 500;
    case 3: return 1500;
    default: return 0;
  }
}

async function seedAgentTemplates() {
  console.log("Seeding agent templates...");

  let created = 0;
  let updated = 0;

  for (const agent of BAARALI_AGENTS) {
    const slug = slugify(agent.name);
    const price = calculatePrice(agent.tier);
    const isPremium = isPremiumTier(agent.tier);

    const existing = await db.query.agentTemplates.findFirst({
      where: eq(agentTemplates.name, agent.name),
    });

    const templateData = {
      name: agent.name,
      slug,
      role: agent.role,
      emoji: agent.emoji,
      color: agent.color,
      category: agent.category,
      tier: agent.tier,
      description: agent.description,
      capabilities: agent.capabilities,
      systemPrompt: agent.systemPrompt,
      tools: agent.tools,
      superpowers: agent.superpowers,
      price,
      isPremium,
      version: 1,
      isActive: true,
      isPublic: true,
      sortIndex: BAARALI_AGENTS.indexOf(agent),
    };

    if (existing) {
      await db
        .update(agentTemplates)
        .set({ ...templateData, updatedAt: new Date() })
        .where(eq(agentTemplates.id, existing.id));
      updated++;
      console.log(`  Updated: ${agent.name}`);
    } else {
      await db.insert(agentTemplates).values(templateData);
      created++;
      console.log(`  Created: ${agent.name}`);
    }
  }

  console.log(`Agent templates seeded: ${created} created, ${updated} updated`);
}

await seedAgentTemplates();
process.exit(0);
