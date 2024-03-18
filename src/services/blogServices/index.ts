import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import { Blog } from "../../models/blog";
import { BlogModel } from "../../models";
import { validateMongoDBId } from "../../utils/helper";
import { deleteImages, imageUpload } from "../../utils/cloudinary";
const fs = require("fs");

//Create A Blog
const createBlog = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const findBlog: DocumentType<Blog> | null = await BlogModel.findOne({
      slug: request.body.slug,
    });
    if (findBlog?.slug === request.body.slug) {
      response.json({
        statusCode: 304,
        message: `Blog with the title "${request.body.title}" already exists. Please choose a different title`,
      });
      return;
    }
    const newBlog: DocumentType<Blog> = await BlogModel.create(request.body);
    response.json({
      statusCode: 200,
      newBlog,
      message: "Blog creation successful!",
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: err,
    });
  }
};

//Upload A Blog
const updateABlog = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { id } = request.params;
  validateMongoDBId(id);
  try {
    const updateBlog: DocumentType<Blog> | null =
      await BlogModel.findByIdAndUpdate(id, request.body, { new: true });
    response.json({
      statusCode: 200,
      message: "Blog updated successfully!",
      updateBlog,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: `Encountered error while updating the blog: ${err}`,
    });
  }
};

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
const deleteABlog = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { id } = request.params;
  const { imageIds } = request.body;
  validateMongoDBId(id);
  try {
    const deleteBlog: DocumentType<Blog> | null =
      await BlogModel.findByIdAndDelete(id);
    if (imageIds.length) {
      await imageIds.map(async (id: string) => await deleteImages(id));
    }
    response.json(deleteBlog);
    response.json({
      statusCode: 200,
      message: "Blog deleted successfully",
      deleteBlog,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: err,
    });
  }
};

//Like A Blog
const likeABlog = expressAsyncHandler(
  async (request: Request, response: Response) => {
    const { blogId } = request.body;
    validateMongoDBId(blogId);

    const blog: DocumentType<Blog> | null = await BlogModel.findById(blogId);

    const loginUserId: string = request?.user?._id;

    const isLiked: boolean | undefined = blog?.isLiked;

    const alreadyDisliked = (blog?.dislikes as string[] | undefined)?.some(
      (userId) => userId?.toString() === loginUserId?.toString()
    );

    if (alreadyDisliked) {
      const blog: DocumentType<Blog> | null = await BlogModel.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          dislikes: false,
        },

        { new: true }
      );
      response.json(blog);
    } else if (isLiked) {
      const blog: DocumentType<Blog> | null = await BlogModel.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      response.json(blog);
    } else {
      const blog: DocumentType<Blog> | null = await BlogModel.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        {
          new: true,
        }
      );
      response.json(blog);
    }
  }
);

//Dislike A Blog
const dislikeABlog = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { blogId } = request.body;
    validateMongoDBId(blogId);

    const blog: DocumentType<Blog> | null = await BlogModel.findById(blogId);

    const loginUserId = request?.user?.id;

    const isDisliked = blog?.isDisliked;

    const alreadyLiked = (blog?.likes as string[] | undefined)?.some(
      (userId) => userId?.toString() === loginUserId?.toString()
    );

    if (alreadyLiked) {
      const blog: DocumentType<Blog> | null = await BlogModel.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        {
          new: true,
        }
      );
      response.json(blog);
    } else if (isDisliked) {
      const blog: DocumentType<Blog> | null = await BlogModel.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      response.json(blog);
    } else {
      const blog: DocumentType<Blog> | null = await BlogModel.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
      response.json(blog);
    }
  }
);

const uploadBlogImages = expressAsyncHandler(
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

      const updateBlog: DocumentType<Blog> | null =
        await BlogModel.findByIdAndUpdate(
          id,
          {
            images,
          },
          { new: true }
        );
      response.json({
        images,
        updateBlog,
        statusCode: 200,
      });
    }
  }
);

const deleteBlogImages = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { imageId } = request.body;
  try {
    const findBlog: DocumentType<Blog> | null =
      await BlogModel.findByIdAndUpdate(id);
    const updateImages = findBlog?.images?.filter(
      (image) => image.public_id !== imageId
    );
    const updateBlog: DocumentType<Blog> | null =
      await BlogModel.findByIdAndUpdate(
        id,
        { images: updateImages },
        { new: true }
      );
    await deleteImages(imageId);
    response.json({
      statusCode: 200,
      message: "Images deletion successful!",
      updateBlog,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: `Error in deleting blog images: ${err}`,
    });
  }
};

export {
  createBlog,
  updateABlog,
  getABlog,
  getAllBlogs,
  deleteABlog,
  likeABlog,
  dislikeABlog,
  uploadBlogImages,
  deleteBlogImages,
};
