import jwt from "jsonwebtoken";

export const generateToken = (id: string | undefined) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "3d" });
};
