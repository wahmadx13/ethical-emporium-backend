import { cloudinary } from "../config/cloudinaryConfig";

export const imageUpload = (file: any) => {
  return new Promise((resolve: any) => {
    cloudinary.uploader.upload(
      file,
      { resource_type: "auto" },
      (error, result: any) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          resolve(null);
        } else {
          resolve({
            url: result?.secure_url,
            asset_id: result?.asset_id,
            public_id: result?.public_id,
          });
        }
      }
    );
  });
};

export const deleteImages = async (file: any) => {
  return await new Promise((resolve: any) => {
    cloudinary.uploader.destroy(file, (result: any) => {
      resolve(
        {
          url: result?.secure_url,
          asset_id: result?.asset_id,
          public_id: result?.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};
