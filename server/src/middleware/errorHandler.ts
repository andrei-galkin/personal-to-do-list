import { Request, Response, NextFunction } from "express";

// ─── Custom Error Class ───────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Central Error Handler ────────────────────────────────────────────────────

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Operational (expected) errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // SQLite constraint errors
  const sqliteErr = err as Error & { code?: string };
  if (sqliteErr.code === "SQLITE_CONSTRAINT") {
    res.status(400).json({
      success: false,
      message: "Database constraint violation",
    });
    return;
  }

  // Unknown errors — don't leak stack in production
  const isDev = process.env.NODE_ENV === "development";
  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    message: isDev ? err.message : "Internal server error",
    ...(isDev && { stack: err.stack }),
  });
};

// ─── 404 Handler ─────────────────────────────────────────────────────────────

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: "Route not found" });
};
