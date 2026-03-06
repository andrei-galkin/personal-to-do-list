import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import type { Task } from "@todo/shared";

// ─── Database Setup ───────────────────────────────────────────────────────────

const DB_PATH = process.env.SQLITE_PATH ?? path.resolve(process.cwd(), "data", "todoapp.db");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ─── Schema Migration ─────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL CHECK(length(title) <= 100),
    description TEXT    NOT NULL DEFAULT '',
    completed   INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_completed  ON tasks(completed);
  CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
`);

// ─── Persistence Entity ───────────────────────────────────────────────────────
// Internal to the DB layer — never exposed beyond the repository.

export interface TaskEntity {
  id: number;
  title: string;
  description: string;
  completed: number;   // SQLite stores booleans as 0/1
  created_at: string;
  updated_at: string;
}

// ─── Mapper: TaskEntity → Task (domain model) ─────────────────────────────────

export const toTask = (entity: TaskEntity): Task => ({
  _id: String(entity.id),
  title: entity.title,
  description: entity.description,
  completed: entity.completed === 1,
  createdAt: entity.created_at,
  updatedAt: entity.updated_at,
});
