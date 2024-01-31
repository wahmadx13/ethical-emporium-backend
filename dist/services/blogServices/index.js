"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBlogImages = exports.dislikeABlog = exports.likeABlog = exports.deleteABlog = exports.getAllBlogs = exports.getABlog = exports.updateABlog = exports.createBlog = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const slugify_1 = __importDefault(require("slugify"));
const models_1 = require("../../models");
const helper_1 = require("../../utils/helper");
const cloudinary_1 = require("../../utils/cloudinary");
const fs = require("fs");
//Create A Blog
const createBlog = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    if (request.body.title) {
        request.body.slug = (0, slugify_1.default)(request.body.title);
    }
    const newBlog = yield models_1.BlogModel.create(request.body);
    response.json(newBlog);
}));
exports.createBlog = createBlog;
//Upload A Blog
const updateABlog = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    if (request.body.title) {
        request.body.slug = (0, slugify_1.default)(request.body.title);
    }
    const updateBlog = yield models_1.BlogModel.findByIdAndUpdate(id, request.body, { new: true });
    response.json(updateBlog);
}));
exports.updateABlog = updateABlog;
//Get A Blog
const getABlog = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    yield models_1.BlogModel.findByIdAndUpdate(id, { $inc: { numberOfViews: 1 } }, { new: true });
    const getBlog = yield models_1.BlogModel.findById(id)
        .populate("likes")
        .populate("dislikes");
    response.json(getBlog);
}));
exports.getABlog = getABlog;
//Get All Blogs
const getAllBlogs = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const getBlogs = yield models_1.BlogModel.find();
    response.json(getBlogs);
}));
exports.getAllBlogs = getAllBlogs;
//Delete A Blog
const deleteABlog = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const deleteBlog = yield models_1.BlogModel.findByIdAndDelete(id);
    response.json(deleteBlog);
}));
exports.deleteABlog = deleteABlog;
//Like A Blog
const likeABlog = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { blogId } = request.body;
    (0, helper_1.validateMongoDBId)(blogId);
    const blog = yield models_1.BlogModel.findById(blogId);
    const loginUserId = (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a._id;
    const isLiked = blog === null || blog === void 0 ? void 0 : blog.isLiked;
    const alreadyDisliked = (_b = blog === null || blog === void 0 ? void 0 : blog.dislikes) === null || _b === void 0 ? void 0 : _b.some((userId) => (userId === null || userId === void 0 ? void 0 : userId.toString()) === (loginUserId === null || loginUserId === void 0 ? void 0 : loginUserId.toString()));
    if (alreadyDisliked) {
        const blog = yield models_1.BlogModel.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            dislikes: false,
        }, { new: true });
        response.json(blog);
    }
    else if (isLiked) {
        const blog = yield models_1.BlogModel.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, { new: true });
        response.json(blog);
    }
    else {
        const blog = yield models_1.BlogModel.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true,
        }, {
            new: true,
        });
        response.json(blog);
    }
}));
exports.likeABlog = likeABlog;
//Dislike A Blog
const dislikeABlog = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const { blogId } = request.body;
    (0, helper_1.validateMongoDBId)(blogId);
    const blog = yield models_1.BlogModel.findById(blogId);
    const loginUserId = (_c = request === null || request === void 0 ? void 0 : request.user) === null || _c === void 0 ? void 0 : _c.id;
    const isDisliked = blog === null || blog === void 0 ? void 0 : blog.isDisliked;
    const alreadyLiked = (_d = blog === null || blog === void 0 ? void 0 : blog.likes) === null || _d === void 0 ? void 0 : _d.some((userId) => (userId === null || userId === void 0 ? void 0 : userId.toString()) === (loginUserId === null || loginUserId === void 0 ? void 0 : loginUserId.toString()));
    if (alreadyLiked) {
        const blog = yield models_1.BlogModel.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, {
            new: true,
        });
        response.json(blog);
    }
    else if (isDisliked) {
        const blog = yield models_1.BlogModel.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, { new: true });
        response.json(blog);
    }
    else {
        const blog = yield models_1.BlogModel.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId },
            isDisliked: true,
        }, { new: true });
        response.json(blog);
    }
}));
exports.dislikeABlog = dislikeABlog;
const uploadBlogImages = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const uploader = (path) => (0, cloudinary_1.imageUpload)(path);
    const urls = [];
    const files = request.files;
    if (Array.isArray(files)) {
        for (const file of files) {
            const { path } = file;
            const newPath = yield uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        const images = urls.map((file) => file);
        const updateBlog = yield models_1.BlogModel.findByIdAndUpdate(id, {
            images,
        }, { new: true });
        response.json({
            images,
            updateBlog,
        });
    }
}));
exports.uploadBlogImages = uploadBlogImages;
