import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
const fs = require("fs");
import { Product } from "../../models/product";
import { User } from "../../models/userModel";
import { ProductModel, UserModel } from "../../models";
import { imageUpload, deleteImages } from "../../utils/cloudinary";

//Create Product
const createProduct = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    if (request.body.title) {
      request.body.slug = slugify(request.body.title);
    }
    const createNewProduct: DocumentType<Product> = await ProductModel.create(
      request.body
    );
    response.json(createNewProduct);
  }
);

//Update A Product
const updateAProduct = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    if (request.body.title) {
      slugify(request.body.title);
    }
    const updateProduct: DocumentType<Product> | null =
      await ProductModel.findByIdAndUpdate({ _id: id }, request.body, {
        new: true,
      });
    response.json(updateProduct);
  }
);

//Get All Products
const getAllProducts = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    // Product Filtering
    const queryObject = { ...request.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((element: string) => delete queryObject[element]);

    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let query: any = ProductModel.find(JSON.parse(queryString));

    // Product Sorting
    if (request.query.sort) {
      const sortBy = (request.query.sort as string).split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Emitting the fields
    const fields = request.query.fields
      ? (request.query.fields as string).split(",").join(" ")
      : "-__v";
    query = query.select(fields);

    // Pagination
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // Check for pagination existence
    if (request.query.page) {
      const productCount = await ProductModel.countDocuments(queryObject);
      if (skip >= productCount) {
        throw new Error("This page does not exist");
      }
    }

    const products: DocumentType<Product>[] = await query;
    response.json(products);
  }
);

//Get A Product
const getAProduct = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    const getProduct: DocumentType<Product> | null =
      await ProductModel.findById(id);
    response.json(getProduct);
  }
);

//Delete A Product
const deleteAProduct = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    const deleteProduct: DocumentType<Product> | null =
      await ProductModel.findByIdAndDelete(id);
    response.json(deleteProduct);
  }
);

//Add To Wishlist
const addToWishlist = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { _id } = request.user;
    const { productId } = request.body;
    const user: DocumentType<User> | null = await UserModel.findById(_id);
    const alreadyAdded = user?.wishList?.find(
      (id) => id.toString() === productId
    );
    if (alreadyAdded) {
      const user: DocumentType<User> | null = await UserModel.findByIdAndUpdate(
        _id,
        { $pull: { wishList: productId } },
        { new: true }
      );
      response.json(user);
    } else {
      const user: DocumentType<User> | null = await UserModel.findByIdAndUpdate(
        _id,
        { $push: { wishList: productId } },
        { new: true }
      );
      await user?.populate("wishList");
      response.json(user);
    }
  }
);

//Rate A Product
const rating = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { _id } = request.user;
    const { star, productId, comment } = request.body;

    // Find the product
    const product: DocumentType<Product> | null = await ProductModel.findById(
      productId
    );

    // Update the user's existing rating if it exists
    const userRating = product?.ratings?.find(
      (rating) => rating.postedBy?.toString() === _id.toString()
    );

    if (userRating) {
      userRating.star = star;
      userRating.comment = comment;
    } else {
      // If the user hasn't rated before, add a new rating
      product?.ratings?.push({
        star: star,
        comment: comment,
        postedBy: _id,
      });
    }

    // Save the updated product
    const updatedProduct = await product?.save();

    // Recalculate the total rating and update the product
    const totalRating = updatedProduct?.ratings?.length || 0;
    const ratingSum = updatedProduct?.ratings
      ?.map((item) => item.star)
      .reduce((prev, curr) => prev! + curr!, 0);

    const actualRating =
      totalRating === 0 ? 0 : Math.round(ratingSum! / totalRating);

    const finalProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        totalRating: actualRating,
      },
      { new: true }
    );

    response.json(finalProduct);
  }
);

const uploadProductImages = expressAsyncHandler(
  async (request: Request, response: Response) => {
    const urls = [];
    const files = request.files;

    if (Array.isArray(files)) {
      for (const file of files) {
        try {
          const { path } = file;
          const newPath = await imageUpload(path);
          urls.push(newPath);
          fs.unlinkSync(path);
        } catch (err) {
          console.error("Error uploading image", err);
        }
      }

      const images = urls.map((url) => url);
      response.json(images);
    }
  }
);

const deleteProductImages = expressAsyncHandler(
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const deleteProdImages = deleteImages(id);
    response.json({ message: "deleted" });
  }
);

export {
  createProduct,
  updateAProduct,
  getAllProducts,
  getAProduct,
  deleteAProduct,
  addToWishlist,
  rating,
  uploadProductImages,
  deleteProductImages,
};

