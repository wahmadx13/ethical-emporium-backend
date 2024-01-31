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
exports.deleteABrand = exports.getAllBBrands = exports.getABrand = exports.updateBrand = exports.createBrand = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const helper_1 = require("../../utils/helper");
const models_1 = require("../../models");
//Create A Brand
const createBrand = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const createBrand = yield models_1.BrandModel.create(request.body);
    response.json(createBrand);
}));
exports.createBrand = createBrand;
//Update A Brand
const updateBrand = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const updateBrand = yield models_1.BrandModel.findByIdAndUpdate(id, request.body, {
        new: true,
    });
    response.json(updateBrand);
}));
exports.updateBrand = updateBrand;
//Get A Brand
const getABrand = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const getBrand = yield models_1.BrandModel.findById(id);
    response.json(getBrand);
}));
exports.getABrand = getABrand;
//Get All Brands
const getAllBBrands = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const getBrands = yield models_1.BrandModel.find();
    response.json(getBrands);
}));
exports.getAllBBrands = getAllBBrands;
//Delete A Brand
const deleteABrand = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const deleteBrand = yield models_1.BrandModel.findByIdAndDelete(id);
    response.json(deleteBrand);
}));
exports.deleteABrand = deleteABrand;
