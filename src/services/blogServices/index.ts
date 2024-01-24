import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import slugify from "slugify";
import { Blog } from "../../models/blog";
import { BlogModel } from "../../models";
import { validateMongoDBId } from "../../utils/helper";

//Create A Blog
const createBlog = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    if (request.body.title) {
      request.body.slug = slugify(request.body.title);
    }
    const newBlog: DocumentType<Blog> = await BlogModel.create(request.body);
    response.json(newBlog);
  }
);

//Upload A Blog
const updateABlog = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    if (request.body.title) {
      request.body.slug = slugify(request.body.title);
    }
    const updateBlog: DocumentType<Blog> | null =
      await BlogModel.findByIdAndUpdate(id, request.body, { new: true });
    response.json(updateBlog);
  }
);

//Get A Blog
const getABlog = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    await BlogModel.findByIdAndUpdate(
      id,
      { $inc: { numberOfViews: 1 } },
      { new: true }
    );
    const getBlog: DocumentType<Blog> | null = await BlogModel.findById(id)
      .populate("likes")
      .populate("dislikes");
    response.json(getBlog);
  }
);

//Get All Blogs
const getAllBlogs = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const getBlogs: DocumentType<Blog>[] = await BlogModel.find();
    response.json(getBlogs);
  }
);

//Delete A Blog
const deleteABlog = expressAsyncHandler(async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id)
    const deleteBlog: DocumentType<Blog> | null = await BlogModel.findByIdAndDelete(id)
    response.json(deleteBlog)
})

export { createBlog, updateABlog, getABlog, getAllBlogs, deleteABlog };
