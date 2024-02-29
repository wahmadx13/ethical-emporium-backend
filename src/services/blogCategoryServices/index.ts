import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import { BlogCategory } from "../../models/blogCategory";
import { BlogCategoryModel } from "../../models";
import { validateMongoDBId } from "../../utils/helper";

//Create A Blog Category
const createBlogCategory = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const findBlogCategory: DocumentType<BlogCategory> | null =
      await BlogCategoryModel.findOne(request.body);
    if (findBlogCategory) {
      response.json({
        statusCode: 304,
        message: `Blog category: ${request.body.title} already exists. Please try adding a new one.`,
      });
      return;
    }

    const createCategory: DocumentType<BlogCategory> =
      await BlogCategoryModel.create(request.body);

    response.json({
      statusCode: 200,
      message: `Blog category: ${request.body.title} added successfully!`,
      createCategory,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: err,
    });
  }
};

//Update A Blog Category
const updateBlogCategory = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { id } = request.params;
  validateMongoDBId(id);
  try {
    const findBlogCategory: DocumentType<BlogCategory> | null =
      await BlogCategoryModel.findById(id);
    if (findBlogCategory?.title === request.body?.title) {
      response.json({
        statusCode: 304,
        message: `Blog category: ${findBlogCategory?.title} already exists. Please try adding a new one`,
      });
      return;
    }
    const updateBlogCategory: DocumentType<BlogCategory> | null =
      await BlogCategoryModel.findByIdAndUpdate(id, request.body, {
        new: true,
      });
    response.json({
      statusCode: 200,
      message: "Blog category updated successfully!",
      updateBlogCategory,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: err,
    });
  }
};

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
const deleteABlogCategory = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { id } = request.params;
  validateMongoDBId(id);
  try {
    const deleteBlogCategory: DocumentType<BlogCategory> | null =
      await BlogCategoryModel.findByIdAndDelete(id);
    response.json({
      statusCode: 200,
      message: `Blog category: ${deleteBlogCategory?.title} deletion successful`,
      deleteBlogCategory,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: err,
    });
  }
};

export {
  createBlogCategory,
  updateBlogCategory,
  getABlogCategory,
  getAllBlogsCategory,
  deleteABlogCategory,
};
