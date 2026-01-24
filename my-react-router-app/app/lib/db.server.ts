export type SqliteDatabase = import("./sqlite.server").SqliteDatabase;

export async function openSqliteDatabase(dbPath: string): Promise<SqliteDatabase> {
  const module = await import("./sqlite.server");
  return module.openSqliteDatabase(dbPath);
}

export async function getSqliteDatabase(): Promise<SqliteDatabase> {
  const module = await import("./sqlite.server");
  return module.getSqliteDatabase();
}

export async function resetSqliteDatabase(): Promise<void> {
  const module = await import("./sqlite.server");
  module.resetSqliteDatabase();
}
