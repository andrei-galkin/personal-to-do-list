import { Request, Response, NextFunction } from "express";

// SQLite uses integer IDs — validate it's a positive integer
export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id < 1) {
    res.status(400).json({ success: false, message: "Invalid task ID format" });
    return;
  }
  next();
};
