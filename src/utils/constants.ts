import dotenv from "dotenv";

dotenv.config();

export const jwtSecret = process.env.JWT_SECRET;
export const mongodbURL = process.env.MONGODB_URL;
