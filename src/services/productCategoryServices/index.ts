import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import { validateMongoDBId } from "../../utils/helper";
import { ProductCategory } from "../../models/productCategory";
import { ProductCategoryModel } from "../../models";

//Create A Product Category
const createProductCategory = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const findProductCategory: DocumentType<ProductCategory> | null =
      await ProductCategoryModel.findOne(request.body);
    if (findProductCategory) {
      response.json({
        statusCode: 304,
        message: `Product category: ${request.body.title} already exists. Please try adding a new one.`,
      });
      return;
    }

    const createCategory: DocumentType<ProductCategory> =
      await ProductCategoryModel.create(request.body);

    response.json({
      statusCode: 200,
      message: `Product category: ${request.body.title} added successfully!`,
      createCategory,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: err,
    });
  }
};

//Update A Product Category
const updateProductCategory = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { id } = request.params;
  validateMongoDBId(id);
  try {
    const findProductCategory: DocumentType<ProductCategory> | null =
      await ProductCategoryModel.findById(id);
    if (findProductCategory?.title === request.body?.title) {
      response.json({
        statusCode: 304,
        message: `Product category: ${findProductCategory?.title} already exists. Please try adding a new one`,
      });
      return;
    }
    const updateProductCategory: DocumentType<ProductCategory> | null =
      await ProductCategoryModel.findByIdAndUpdate(id, request.body, {
        new: true,
      });
    response.json({
      statusCode: 200,
      message: "Product category updated successfully!",
      updateProductCategory,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: err,
    });
  }
};

//Get A Product Category
const getAProductCategory = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const getProductCategory: DocumentType<ProductCategory> | null =
      await ProductCategoryModel.findById(id);
    response.json(getProductCategory);
  }
);

//Get All Product Categories
const getAllProductCategories = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const getProductsCategory: DocumentType<ProductCategory>[] =
      await ProductCategoryModel.find();
    response.json(getProductsCategory);
  }
);

//Delete A Product Category
const deleteAProductCategory = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { id } = request.params;
  validateMongoDBId(id);
  try {
    const deleteProductCategory: DocumentType<ProductCategory> | null =
      await ProductCategoryModel.findByIdAndDelete(id);
    response.json({
      statusCode: 200,
      message: `Product category: ${deleteProductCategory?.title} deletion successful`,
      deleteProductCategory,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: err,
    });
  }
};

export {
  createProductCategory,
  updateProductCategory,
  getAProductCategory,
  getAllProductCategories,
  deleteAProductCategory,
};
