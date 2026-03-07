import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { Task, TaskStatus } from "../../../shared/types";

// ─── Database Setup ───────────────────────────────────────────────────────────

const DB_PATH = process.env.SQLITE_PATH ?? path.resolve(process.cwd(), "data", "todoapp.db");
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ─── Schema Migration ─────────────────────────────────────────────────────────

// Create table (original schema, no status column yet)
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL CHECK(length(title) <= 100),
    description TEXT    NOT NULL DEFAULT '',
    completed   INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
`);

// Add status column if it doesn't exist yet (safe to run on every start)
const columns = db.prepare("PRAGMA table_info(tasks)").all() as { name: string }[];
const hasStatus = columns.some((c) => c.name === "status");

if (!hasStatus) {
  db.exec(`
    ALTER TABLE tasks ADD COLUMN status TEXT NOT NULL DEFAULT 'ACTIVE';
    UPDATE tasks SET status = CASE WHEN completed = 1 THEN 'DONE' ELSE 'ACTIVE' END;
  `);
}

db.exec(`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);`);

// ─── Persistence Entity ───────────────────────────────────────────────────────

export interface TaskEntity {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  completed: number;
  created_at: string;
  updated_at: string;
}

// ─── Mapper: TaskEntity → Task ────────────────────────────────────────────────

export const toTask = (entity: TaskEntity): Task => ({
  _id: String(entity.id),
  title: entity.title,
  description: entity.description,
  status: entity.status,
  completed: entity.status === "DONE",
  createdAt: entity.created_at,
  updatedAt: entity.updated_at,
});