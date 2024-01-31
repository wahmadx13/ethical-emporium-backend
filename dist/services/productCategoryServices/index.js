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
exports.deleteAProductCategory = exports.getAllProductCategories = exports.getAProductCategory = exports.updateProductCategory = exports.createProductCategory = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const helper_1 = require("../../utils/helper");
const models_1 = require("../../models");
//Create A Product Category
const createProductCategory = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const createCategory = yield models_1.ProductCategoryModel.create(request.body);
    response.json(createCategory);
}));
exports.createProductCategory = createProductCategory;
//Update A Product Category
const updateProductCategory = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const updateCategory = yield models_1.ProductCategoryModel.findByIdAndUpdate(id, request.body, {
        new: true,
    });
    response.json(updateCategory);
}));
exports.updateProductCategory = updateProductCategory;
//Get A Product Category
const getAProductCategory = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const getProductCategory = yield models_1.ProductCategoryModel.findById(id);
    response.json(getProductCategory);
}));
exports.getAProductCategory = getAProductCategory;
//Get All Product Categories
const getAllProductCategories = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const getProductsCategory = yield models_1.ProductCategoryModel.find();
    response.json(getProductsCategory);
}));
exports.getAllProductCategories = getAllProductCategories;
//Delete A Product Category
const deleteAProductCategory = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const deleteProductCategory = yield models_1.ProductCategoryModel.findByIdAndDelete(id);
    response.json(deleteProductCategory);
}));
exports.deleteAProductCategory = deleteAProductCategory;
