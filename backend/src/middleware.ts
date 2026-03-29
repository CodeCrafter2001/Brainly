import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { JWT_PASSWORD } from "./config.js";

interface CustomRequest extends Request {
  userId?: mongoose.Types.ObjectId;  // ✅ changed from string to ObjectId
}

interface MyJwtPayload extends JwtPayload {
  id: string;
}

export const userMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "You are not logged in" });
  }

  try {
   const token = authHeader.startsWith("Bearer ")
  ? authHeader.split(" ")[1]
  : authHeader;

const decoded = jwt.verify(token as string, JWT_PASSWORD);

    if (typeof decoded === "string") {
      return res.status(403).json({ message: "Invalid token" });
    }

    // ✅ Convert to ObjectId here once, so index.ts gets the right type
    req.userId = new mongoose.Types.ObjectId((decoded as MyJwtPayload).id);
    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};