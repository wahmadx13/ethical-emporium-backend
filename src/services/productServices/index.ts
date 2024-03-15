import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
const fs = require("fs");
import { Product } from "../../models/product";
import { User } from "../../models/user";
import { ProductModel, UserModel } from "../../models";
import { imageUpload, deleteImages } from "../../utils/cloudinary";

//Create Product
const createProduct = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const findProduct: DocumentType<Product> | null =
      await ProductModel.findOne({
        slug: request.body.slug,
      });
    if (findProduct?.slug === request.body.slug) {
      response.json({
        statusCode: 304,
        message: `Product with the title "${request.body.title}" already exists. Please choose a different title`,
      });
      return;
    }
    const createNewProduct: DocumentType<Product> = await ProductModel.create(
      request.body
    );
    response.json({
      statusCode: 200,
      createNewProduct,
      message: "Product creation successful",
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: err,
    });
  }
};

//Update A Product
const updateAProduct = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { id } = request.params;
  try {
    const updateProduct: DocumentType<Product> | null =
      await ProductModel.findByIdAndUpdate({ _id: id }, request.body, {
        new: true,
      });
    response.json({
      statusCode: 200,
      message: "Product updated successfully!",
      updateProduct,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: `Encountered error while updating the product: ${err}`,
    });
  }
};

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
const deleteAProduct = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { id } = request.params;
  const { imageIds } = request.body;
  try {
    const deleteProduct: DocumentType<Product> | null =
      await ProductModel.findByIdAndDelete(id);
    await imageIds.map(async (id: string) => await deleteImages(id));
    response.json({
      statusCode: 200,
      message: "Product deleted successfully",
      deleteProduct,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: err,
    });
  }
};

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

    // Calculate the average rating
    let averageRating = 0;
    if (totalRating !== 0) {
      averageRating = ratingSum! / totalRating;
    }

    const finalProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        totalRating: averageRating,
        $inc: { numberOfUsersRated: 1 },
      },
      { new: true }
    );

    response.json(finalProduct);
  }
);

const uploadProductImages = expressAsyncHandler(
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const uploader = (path: string) => imageUpload(path);
    const urls = [];
    const files = request.files;

    if (Array.isArray(files)) {
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath);
        fs.unlinkSync(path);
      }

      const images = urls.map((file) => file);

      const updateProduct: DocumentType<Product> | null =
        await ProductModel.findByIdAndUpdate(
          id,
          {
            images,
          },
          { new: true }
        );
      response.json({
        images,
        updateProduct,
        statusCode: 200,
      });
    }
  }
);

const deleteProductImages = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { imageId } = request.body;
  try {
    const findProduct: DocumentType<Product> | null =
      await ProductModel.findByIdAndUpdate(id);
    const updateImages = findProduct?.images?.filter(
      (image) => image.public_id !== imageId
    );
    console.log("images", updateImages);
    const updateProduct: DocumentType<Product> | null =
      await ProductModel.findByIdAndUpdate(
        id,
        { images: updateImages },
        { new: true }
      );
    await deleteImages(imageId);
    response.json({
      statusCode: 200,
      message: "Images deletion successful!",
      updateProduct,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: `Error in deleting product images: ${err}`,
    });
  }
};

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

