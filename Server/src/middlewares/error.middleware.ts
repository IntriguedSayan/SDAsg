import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(err.message + "-------" + err.stack);

  // Handle MongoDB duplicate key error
  if (err.name === "MongoError" && (err as any).code === 11000) {
    res.status(400).json({ error: "Duplicate entry found" });
    return;
  }

  // Handle MongoDB validation error
  if (err.name === "ValidationError") {
    res.status(400).json({ error: err.message });
    return;
  }

  // Handle not found errors
  if (err.message.includes("not found")) {
    res.status(404).json({ error: err.message });
    return;
  }

  // Handle all other errors
  res.status(500).json({ error: err.message });
}; 