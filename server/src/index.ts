import "dotenv/config";
import app from "./app";
import { db } from "./models/task.model";

const PORT = Number(process.env.PORT ?? 5000);

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

const shutdown = (signal: string): void => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  db.close();
  console.log("SQLite connection closed.");
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// ─── Bootstrap ───────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ SQLite database ready`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV ?? "development"}`);
});
