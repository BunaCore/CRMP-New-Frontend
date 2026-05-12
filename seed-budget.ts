import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = "postgres://postgres:postgres@localhost:5432/crmp_dev"; // Typical local URL
const client = postgres(connectionString);
const db = drizzle(client);

async function run() {
  try {
    console.log("Checking for projects without budget items...");

    // 1. Find projects
    const projects = await db.execute(postgres.sql`
      SELECT p.project_id, pr.budget_amount, p.project_title
      FROM projects p
      LEFT JOIN proposals pr ON p.project_id = pr.project_id
      WHERE p.is_funded = true
    `);

    console.log(`Found ${projects.length} funded projects.`);

    for (const p of projects) {
      if (!p.budget_amount) continue;

      const items = await db.execute(postgres.sql`
        SELECT id FROM project_budget_items WHERE project_id = ${p.project_id}
      `);

      if (items.length === 0) {
        console.log(`Seeding budget items for project: ${p.project_title} (${p.project_id})`);

        // Let's create two default items for the total budget amount
        const half = Number(p.budget_amount) / 2;

        await db.execute(postgres.sql`
          INSERT INTO project_budget_items (project_id, description, category, amount, status)
          VALUES 
          (${p.project_id}, 'Equipment & Materials', 'Equipment', ${half}, 'AVAILABLE'),
          (${p.project_id}, 'Travel & Fieldwork', 'Travel', ${half}, 'AVAILABLE')
        `);
        console.log("  -> Inserted 2 budget items.");
      } else {
        console.log(`Project ${p.project_title} already has ${items.length} budget items.`);
      }
    }
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    process.exit(0);
  }
}
run();
