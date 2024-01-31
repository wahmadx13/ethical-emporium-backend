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
exports.deleteABlogCategory = exports.getAllBlogsCategory = exports.getABlogCategory = exports.updateBlogCategory = exports.createBlogCategory = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const models_1 = require("../../models");
const helper_1 = require("../../utils/helper");
//Create A Blog Category
const createBlogCategory = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const createCategory = yield models_1.BlogCategoryModel.create(request.body);
    response.json(createCategory);
}));
exports.createBlogCategory = createBlogCategory;
//Update A Blog Category
const updateBlogCategory = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const updateCategory = yield models_1.BlogCategoryModel.findByIdAndUpdate(id, request.body, {
        new: true,
    });
    response.json(updateCategory);
}));
exports.updateBlogCategory = updateBlogCategory;
//Get A Blog Category
const getABlogCategory = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const getBlogCategory = yield models_1.BlogCategoryModel.findById(id);
    response.json(getBlogCategory);
}));
exports.getABlogCategory = getABlogCategory;
//Get All Blogs Category
const getAllBlogsCategory = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const getBlogsCategory = yield models_1.BlogCategoryModel.find();
    response.json(getBlogsCategory);
}));
exports.getAllBlogsCategory = getAllBlogsCategory;
//Delete A Blog Category
const deleteABlogCategory = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const deleteBlogCategory = yield models_1.BlogCategoryModel.findByIdAndDelete(id);
    response.json(deleteBlogCategory);
}));
exports.deleteABlogCategory = deleteABlogCategory;
