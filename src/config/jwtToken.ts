import jwt from "jsonwebtoken";
import { jwtSecret } from "../utils/constants";

export const generateToken = (id: string) => {
  if (!jwtSecret) {
    throw new Error("Jwt secret is not defined");
  }
  return jwt.sign({ id }, jwtSecret, { expiresIn: "1d" });
};
