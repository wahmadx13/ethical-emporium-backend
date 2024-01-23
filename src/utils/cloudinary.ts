import { cloudinary } from "../config/cloudinaryConfig";
import { ImageResult } from "../types/custom";

export const imageUpload = async (file: any) => {
  return new Promise((resolve: any) => {
    cloudinary.uploader.upload(file, (result: ImageResult) => {
      console.log("Cloudinary upload result:", result);
      resolve(
        {
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

export const deleteImages = async (file: any) => {
  return new Promise((resolve: any) => {
    cloudinary.uploader.destroy(file, (result: ImageResult) => {
      resolve(
        {
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};
