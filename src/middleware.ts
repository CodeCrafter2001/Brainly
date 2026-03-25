import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";

interface CustomRequest extends Request {
  userId?: string;
}

interface MyJwtPayload extends JwtPayload {
  id: string;
}

export const userMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
 const header = req.headers["authorization"];

  if (!header) {
    return res.status(403).json({
      message: "You are not logged in"
    });
  }

  try {
    const decoded = jwt.verify(header as string, JWT_PASSWORD);

    if (typeof decoded === "string") {
      return res.status(403).json({
        message: "Invalid token"
      });
    }

    req.userId = (decoded as MyJwtPayload).id;
    next();
  } catch {
    return res.status(403).json({
      message: "Invalid or expired token"
    });
  }
};