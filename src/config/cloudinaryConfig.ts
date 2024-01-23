import * as cloudinaryLib from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinaryLib.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinary = cloudinaryLib.v2;
