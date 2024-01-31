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
exports.deleteProductImages = exports.uploadProductImages = exports.rating = exports.addToWishlist = exports.deleteAProduct = exports.getAProduct = exports.getAllProducts = exports.updateAProduct = exports.createProduct = void 0;
const slugify_1 = __importDefault(require("slugify"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const fs = require("fs");
const models_1 = require("../../models");
const cloudinary_1 = require("../../utils/cloudinary");
//Create Product
const createProduct = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    if (request.body.title) {
        request.body.slug = (0, slugify_1.default)(request.body.title);
    }
    const createNewProduct = yield models_1.ProductModel.create(request.body);
    response.json(createNewProduct);
}));
exports.createProduct = createProduct;
//Update A Product
const updateAProduct = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    if (request.body.title) {
        (0, slugify_1.default)(request.body.title);
    }
    const updateProduct = yield models_1.ProductModel.findByIdAndUpdate({ _id: id }, request.body, {
        new: true,
    });
    response.json(updateProduct);
}));
exports.updateAProduct = updateAProduct;
//Get All Products
const getAllProducts = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    // Product Filtering
    const queryObject = Object.assign({}, request.query);
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((element) => delete queryObject[element]);
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = models_1.ProductModel.find(JSON.parse(queryString));
    // Product Sorting
    if (request.query.sort) {
        const sortBy = request.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    }
    else {
        query = query.sort("-createdAt");
    }
    // Emitting the fields
    const fields = request.query.fields
        ? request.query.fields.split(",").join(" ")
        : "-__v";
    query = query.select(fields);
    // Pagination
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    // Check for pagination existence
    if (request.query.page) {
        const productCount = yield models_1.ProductModel.countDocuments(queryObject);
        if (skip >= productCount) {
            throw new Error("This page does not exist");
        }
    }
    const products = yield query;
    response.json(products);
}));
exports.getAllProducts = getAllProducts;
//Get A Product
const getAProduct = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const getProduct = yield models_1.ProductModel.findById(id);
    response.json(getProduct);
}));
exports.getAProduct = getAProduct;
//Delete A Product
const deleteAProduct = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const deleteProduct = yield models_1.ProductModel.findByIdAndDelete(id);
    response.json(deleteProduct);
}));
exports.deleteAProduct = deleteAProduct;
//Add To Wishlist
const addToWishlist = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { _id } = request.user;
    const { productId } = request.body;
    const user = yield models_1.UserModel.findById(_id);
    const alreadyAdded = (_a = user === null || user === void 0 ? void 0 : user.wishList) === null || _a === void 0 ? void 0 : _a.find((id) => id.toString() === productId);
    if (alreadyAdded) {
        const user = yield models_1.UserModel.findByIdAndUpdate(_id, { $pull: { wishList: productId } }, { new: true });
        response.json(user);
    }
    else {
        const user = yield models_1.UserModel.findByIdAndUpdate(_id, { $push: { wishList: productId } }, { new: true });
        yield (user === null || user === void 0 ? void 0 : user.populate("wishList"));
        response.json(user);
    }
}));
exports.addToWishlist = addToWishlist;
//Rate A Product
const rating = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    const { _id } = request.user;
    const { star, productId, comment } = request.body;
    // Find the product
    const product = yield models_1.ProductModel.findById(productId);
    // Update the user's existing rating if it exists
    const userRating = (_b = product === null || product === void 0 ? void 0 : product.ratings) === null || _b === void 0 ? void 0 : _b.find((rating) => { var _a; return ((_a = rating.postedBy) === null || _a === void 0 ? void 0 : _a.toString()) === _id.toString(); });
    if (userRating) {
        userRating.star = star;
        userRating.comment = comment;
    }
    else {
        // If the user hasn't rated before, add a new rating
        (_c = product === null || product === void 0 ? void 0 : product.ratings) === null || _c === void 0 ? void 0 : _c.push({
            star: star,
            comment: comment,
            postedBy: _id,
        });
    }
    // Save the updated product
    const updatedProduct = yield (product === null || product === void 0 ? void 0 : product.save());
    // Recalculate the total rating and update the product
    const totalRating = ((_d = updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct.ratings) === null || _d === void 0 ? void 0 : _d.length) || 0;
    const ratingSum = (_e = updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct.ratings) === null || _e === void 0 ? void 0 : _e.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);
    const actualRating = totalRating === 0 ? 0 : Math.round(ratingSum / totalRating);
    const finalProduct = yield models_1.ProductModel.findByIdAndUpdate(productId, {
        totalRating: actualRating,
    }, { new: true });
    response.json(finalProduct);
}));
exports.rating = rating;
const uploadProductImages = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
        const updateProduct = yield models_1.ProductModel.findByIdAndUpdate(id, {
            images,
        }, { new: true });
        response.json({
            images,
            updateProduct,
        });
    }
}));
exports.uploadProductImages = uploadProductImages;
const deleteProductImages = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const deleteProdImages = (0, cloudinary_1.deleteImages)(id);
    response.json({ message: "deleted", deleteImages: cloudinary_1.deleteImages });
}));
exports.deleteProductImages = deleteProductImages;
