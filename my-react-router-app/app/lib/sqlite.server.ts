import type * as BetterSqlite3 from "better-sqlite3";

export type SqliteDatabase = BetterSqlite3.Database;

let cachedDb: SqliteDatabase | null = null;

async function ensureSqliteDirectory(dbPath: string) {
  if (dbPath === ":memory:") {
    return;
  }

  const fs = await import("node:fs");
  const path = await import("node:path");
  const directory = path.dirname(dbPath);
  fs.mkdirSync(directory, { recursive: true });
}

export async function openSqliteDatabase(dbPath: string): Promise<SqliteDatabase> {
  const { default: SqliteDatabaseConstructor } = await import("better-sqlite3");
  await ensureSqliteDirectory(dbPath);
  return new SqliteDatabaseConstructor(dbPath);
}

export async function getSqliteDatabase(): Promise<SqliteDatabase> {
  if (cachedDb) {
    return cachedDb;
  }

  const nodeEnv = (globalThis as { process?: { env?: Record<string, string> } })
    .process?.env;
  const dbPath = nodeEnv?.TODO_DB_PATH ?? "db/local.sqlite";
  cachedDb = await openSqliteDatabase(dbPath);
  return cachedDb;
}

export function resetSqliteDatabase() {
  if (cachedDb) {
    cachedDb.close();
    cachedDb = null;
  }
}
