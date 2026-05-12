import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = "postgres://postgres:postgres@localhost:5432/crmp_dev"; // Replace with correct connection string if needed
const client = postgres(connectionString);
const db = drizzle(client);

async function run() {
  try {
    const res = await db.execute(postgres.sql`SELECT * FROM project_budget_items`);
    console.log("Budget Items Count:", res.length);
    console.log("Budget Items:", res);

    const res2 = await db.execute(postgres.sql`SELECT * FROM disbursement_requests`);
    console.log("Requests:", res2);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    process.exit(0);
  }
}
run();
