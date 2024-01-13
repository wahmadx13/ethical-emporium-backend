import jwt from "jsonwebtoken";
import { jwtSecret } from "../utils/constants";

export const generateRefreshToken = (id: string) => {
  if (!jwtSecret) {
    throw new Error("JWT secret is not defined");
  }
  return jwt.sign({ id }, jwtSecret, { expiresIn: "3d" });
};
