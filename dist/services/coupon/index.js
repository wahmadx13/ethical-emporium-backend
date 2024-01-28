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
exports.deleteACoupon = exports.getAllCoupons = exports.getACoupon = exports.updateACoupon = exports.createACoupon = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const helper_1 = require("../../utils/helper");
const models_1 = require("../../models");
//Create A Coupon
const createACoupon = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const createCoupon = yield models_1.CouponModel.create(request.body);
    response.json(createCoupon);
}));
exports.createACoupon = createACoupon;
//Update A Coupon
const updateACoupon = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const updateCoupon = yield models_1.CouponModel.findByIdAndUpdate(id, request.body, {
        new: true,
    });
    response.json(updateCoupon);
}));
exports.updateACoupon = updateACoupon;
//Get A Coupon
const getACoupon = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const getCoupon = yield models_1.CouponModel.findById(id);
    response.json(getCoupon);
}));
exports.getACoupon = getACoupon;
//Get All Coupons
const getAllCoupons = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const getColors = yield models_1.CouponModel.find();
    response.json(getColors);
}));
exports.getAllCoupons = getAllCoupons;
//Delete A Coupon
const deleteACoupon = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const deleteCoupon = yield models_1.CouponModel.findByIdAndDelete(id);
    response.json(deleteCoupon);
}));
exports.deleteACoupon = deleteACoupon;
//# sourceMappingURL=index.js.map