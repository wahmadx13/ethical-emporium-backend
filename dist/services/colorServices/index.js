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
exports.deleteAColor = exports.getAllColors = exports.getAColor = exports.updateColor = exports.createColor = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const helper_1 = require("../../utils/helper");
const models_1 = require("../../models");
//Create A Color
const createColor = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const createColor = yield models_1.ColorModel.create(request.body);
    response.json(createColor);
}));
exports.createColor = createColor;
//Update A Color
const updateColor = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const updateColor = yield models_1.ColorModel.findByIdAndUpdate(id, request.body, {
        new: true,
    });
    response.json(updateColor);
}));
exports.updateColor = updateColor;
//Get A Color
const getAColor = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const getColor = yield models_1.ColorModel.findById(id);
    response.json(getColor);
}));
exports.getAColor = getAColor;
//Get All Colors
const getAllColors = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const getColors = yield models_1.ColorModel.find();
    response.json(getColors);
}));
exports.getAllColors = getAllColors;
//Delete A Color
const deleteAColor = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const deleteColor = yield models_1.ColorModel.findByIdAndDelete(id);
    response.json(deleteColor);
}));
exports.deleteAColor = deleteAColor;
