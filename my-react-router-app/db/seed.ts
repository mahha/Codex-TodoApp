import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { seedTodos } from "../app/lib/seed-data";
import { openSqliteDatabase } from "../app/lib/db.server";
import { createSqliteTodoRepository } from "../app/lib/todos.server";

const migrationsDir = join(process.cwd(), "db", "migrations");

const shouldPrintSql = process.argv.includes("--print-sql");

const buildSeedSql = () => {
  const statements = seedTodos.map((todo) => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    return {
      id,
      title: todo.title,
      description: todo.description,
      created_at: createdAt,
    };
  });

  return statements
    .map(
      (todo) =>
        "INSERT INTO todos (id, title, description, created_at) VALUES (" +
        `'${todo.id}', ` +
        `'${todo.title.replace(/'/g, "''")}', ` +
        `'${todo.description.replace(/'/g, "''")}', ` +
        `'${todo.created_at}');`
    )
    .join("\n");
};

async function applyMigrations(db: Awaited<ReturnType<typeof openSqliteDatabase>>) {
  const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of migrationFiles) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    db.exec(sql);
  }
}

async function seedLocalDatabase() {
  const dbPath = process.env.TODO_DB_PATH ?? "db/local.sqlite";
  const db = await openSqliteDatabase(dbPath);
  await applyMigrations(db);
  const repository = createSqliteTodoRepository(db);

  for (const todo of seedTodos) {
    await repository.createTodo(todo);
  }

  db.close();
}

async function main() {
  if (shouldPrintSql) {
    console.log(buildSeedSql());
    return;
  }

  await seedLocalDatabase();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
