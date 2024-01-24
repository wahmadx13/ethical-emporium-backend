import { Request, Response, NextFunction } from "express";
import multer from "multer";
import sharp from "sharp";
const path = require("path");
const fs = require("fs");

type MulterFilterCallback = (error: any, acceptFile: boolean) => void;

const multerStorage = multer.diskStorage({
  destination: function (
    request: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, path.join(__dirname, "../../public/images"));
  },
  filename: function (
    request: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (
  request: Request,
  file: Express.Multer.File,
  cb: MulterFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldNameSize: 2000000 },
});

const resizeProductImage = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!request.files) return next();
  const files = request.files as Express.Multer.File[];
  await Promise.all(
    files.map(async (file): Promise<void> => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`);
      fs.unlinkSync(`public/images/products/${file.filename}`);
    })
  );
  next();
};

const resizeBlogImage = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!request.files) return next();
  const files = request.files as Express.Multer.File[];
  await Promise.all(
    files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/blogs/${file.filename}`);
      fs.unlinkSync(`public/images/blogs/${file.filename}`);
    })
  );
  next();
};

export { uploadPhoto, resizeProductImage, resizeBlogImage };
