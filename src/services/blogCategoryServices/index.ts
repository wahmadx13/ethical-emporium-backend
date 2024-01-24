import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import { BlogCategory } from "../../models/blogCategory";
import { BlogCategoryModel } from "../../models";
import { validateMongoDBId } from "../../utils/helper";

//Create A Blog Category
const createBlogCategory = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const createCategory: DocumentType<BlogCategory> =
      await BlogCategoryModel.create(request.body);

    response.json(createCategory);
  }
);

//Update A Blog Category
const updateBlogCategory = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const updateCategory: DocumentType<BlogCategory> | null =
      await BlogCategoryModel.findByIdAndUpdate(id, request.body, {
        new: true,
      });
    response.json(updateCategory);
  }
);

//Get A Blog Category
const getABlogCategory = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const getBlogCategory: DocumentType<BlogCategory> | null =
      await BlogCategoryModel.findById(id);
    response.json(getBlogCategory);
  }
);

//Get All Blogs Category
const getAllBlogsCategory = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const getBlogsCategory: DocumentType<BlogCategory>[] =
      await BlogCategoryModel.find();
    response.json(getBlogsCategory);
  }
);

//Delete A Blog Category
const deleteABlogCategory = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const deleteBlogCategory: DocumentType<BlogCategory> | null =
      await BlogCategoryModel.findByIdAndDelete(id);
    response.json(deleteBlogCategory);
  }
);

export {
  createBlogCategory,
  updateBlogCategory,
  getABlogCategory,
  getAllBlogsCategory,
  deleteABlogCategory,
};
