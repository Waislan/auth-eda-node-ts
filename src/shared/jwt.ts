import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "VERY_SECRET_DO_NOT_USE_IN_PROD";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export function generateToken(payload: object, expiresIn = "1h"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

export function decodeToken(token: string): any {
  return jwt.decode(token);
}
