import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { openSqliteDatabase } from "../app/lib/sqlite.server";

const migrationsDir = join(process.cwd(), "db", "migrations");

async function applyMigrations(dbPath: string) {
  const db = await openSqliteDatabase(dbPath);
  const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of migrationFiles) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    db.exec(sql);
  }

  db.close();
}

async function main() {
  const dbPath = process.env.TODO_DB_PATH ?? "db/local.sqlite";
  await applyMigrations(dbPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
