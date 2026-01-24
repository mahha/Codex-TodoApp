import { openSqliteDatabase } from "../app/lib/sqlite.server";

async function main() {
  const dbPath = process.env.TODO_DB_PATH ?? "db/local.sqlite";
  const db = await openSqliteDatabase(dbPath);
  db.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
