import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import { validateMongoDBId } from "../../utils/helper";
import { ProductCategory } from "../../models/productCategory";
import { ProductCategoryModel } from "../../models";

//Create A Product Category
const createProductCategory = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const createCategory: DocumentType<ProductCategory> =
      await ProductCategoryModel.create(request.body);

    response.json(createCategory);
  }
);

//Update A Product Category
const updateProductCategory = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const updateCategory: DocumentType<ProductCategory> | null =
      await ProductCategoryModel.findByIdAndUpdate(id, request.body, {
        new: true,
      });
    response.json(updateCategory);
  }
);

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
const deleteAProductCategory = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const deleteProductCategory: DocumentType<ProductCategory> | null =
      await ProductCategoryModel.findByIdAndDelete(id);
    response.json(deleteProductCategory);
  }
);

export {
  createProductCategory,
  updateProductCategory,
  getAProductCategory,
  getAllProductCategories,
  deleteAProductCategory,
};
