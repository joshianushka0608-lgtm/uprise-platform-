import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db from "../db/index.js";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "fallback-secret-change-me";

  try {
    // Check if token is blocklisted
    const blocked = db
      .prepare("SELECT id FROM jwt_blocklist WHERE token_jti = ?")
      .get(token.split(".")[2]); // jti is the 3rd part of JWT

    if (blocked) {
      res.status(401).json({ error: "Token has been revoked" });
      return;
    }

    const decoded = jwt.verify(token, secret) as {
      userId: string;
      email: string;
      jti: string;
    };

    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next();
    return;
  }

  authenticate(req, res, next);
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const userRoles = db
      .prepare(
        "SELECT role_type FROM roles WHERE user_id = ? AND active = 1 AND role_type IN (" +
          roles.map(() => "?").join(",") +
          ")"
      )
      .all(req.userId, ...roles) as { role_type: string }[];

    if (userRoles.length === 0) {
      res
        .status(403)
        .json({ error: `You need one of these roles: ${roles.join(", ")}` });
      return;
    }

    next();
  };
};
