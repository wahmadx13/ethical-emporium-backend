import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
import { Product, ProductModel } from "../../models/product";
import { User, UserModel } from "../../models/userModel";

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
      let user: DocumentType<User> | null = await UserModel.findByIdAndUpdate(
        _id,
        { $pull: { wishList: productId } },
        { new: true }
      );
      response.json(user);
    } else {
      let user: DocumentType<User> | null = await UserModel.findByIdAndUpdate(
        _id,
        { $push: { wishList: productId } },
        { new: true }
      );
      response.json(user);
    }
  }
);

//Rate A Product
const rating = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { _id } = request.user;
    const { star, productId, comment } = request.body;
    const product: DocumentType<Product> | null = await ProductModel.findById(
      productId
    );
    let alreadyRated = product?.ratings?.find((userId) => {
      userId.postedBy.toString() === _id.toString();
    });
    if (alreadyRated) {
      await ProductModel.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: {
            "ratings.$.star": star,
            "ratings.$.comment": comment,
          },
        },
        { new: true }
      );
    } else {
      await ProductModel.findByIdAndUpdate(
        productId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedBy: _id,
            },
          },
        },
        { new: true }
      );
    }
    const getAllRatings = await ProductModel.findById(productId);

    let totalRating = getAllRatings?.ratings?.length;

    let ratingSum = getAllRatings?.ratings
      ?.map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);

    let actualRating = Math.round(ratingSum! / totalRating!);
    let finalProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        totalRating: actualRating,
      },
      { new: true }
    );
    response.json(finalProduct);
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
};
