import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

export function databasePath(): string {
  return resolve(process.env.DATABASE_PATH ?? "data/service.sqlite3");
}

export function openDatabase(): DatabaseSync {
  const path = databasePath();
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;");
  return db;
}

export function migrate(): void {
  const db = openDatabase();
  db.exec(`CREATE TABLE IF NOT EXISTS schema_versions (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL
  );`);
  db.prepare("INSERT OR IGNORE INTO schema_versions(version, applied_at) VALUES(1, ?)")
    .run(new Date().toISOString());
  db.close();
}
