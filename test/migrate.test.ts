import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import { migrate } from "../src/database.js";

test("迁移可重复执行并记录基础版本", () => {
  process.env.DATABASE_PATH = join(mkdtempSync(join(tmpdir(), "service-")), "test.sqlite3");
  migrate();
  migrate();
  const db = new DatabaseSync(process.env.DATABASE_PATH);
  const row = db.prepare("SELECT COUNT(*) AS count FROM schema_versions").get() as { count: number };
  assert.equal(row.count, 1);
  db.close();
});
