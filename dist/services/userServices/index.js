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
exports.deleteOrder = exports.updateOrderStatus = exports.getAllOrders = exports.getAllOrdersForUser = exports.getAllOrdersByAUser = exports.createOrder = exports.emptyUserCart = exports.removeAnItemFromCart = exports.addToUserCart = void 0;
const uuid_1 = require("uuid");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const helper_1 = require("../../utils/helper");
const models_1 = require("../../models");
//Add To Cart
const addToUserCart = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, count, color } = request.body;
    const { _id } = request.user;
    (0, helper_1.validateMongoDBId)(_id);
    (0, helper_1.validateMongoDBId)(productId);
    const user = yield models_1.UserModel.findById(_id);
    const findProduct = yield models_1.ProductModel.findById(productId);
    if (!user) {
        response.status(404).json({ message: "User not found" });
        return;
    }
    if (!findProduct) {
        response.status(404).json({ message: "Product not found" });
        return;
    }
    let cartProduct = [...user.cart];
    const existingCartItemIndex = cartProduct.findIndex((item) => { var _a; return ((_a = item._id) === null || _a === void 0 ? void 0 : _a.toString()) === productId && item.color === color; });
    if (existingCartItemIndex !== -1) {
        // If the same product with the same color is already in the cart, update its count and total price
        cartProduct[existingCartItemIndex].count += count;
        cartProduct[existingCartItemIndex].totalPrice +=
            findProduct.price * count;
    }
    else {
        // If the product with the same color is not in the cart, add it as a new item
        cartProduct.push({
            _id: findProduct._id,
            count,
            color,
            singleItemPrice: findProduct.price,
            totalPrice: findProduct.price * count,
        });
    }
    // Calculate cart total
    const cartTotal = cartProduct.reduce((total, item) => total + item.totalPrice, 0);
    // Update user's cart and cartTotal
    const updatedUser = yield models_1.UserModel.findByIdAndUpdate(_id, { cart: cartProduct, cartTotal }, { new: true });
    response.json(updatedUser);
}));
exports.addToUserCart = addToUserCart;
//Remove From Cart
const removeAnItemFromCart = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, color } = request.body;
    const { _id } = request.user;
    (0, helper_1.validateMongoDBId)(_id);
    const user = yield models_1.UserModel.findById(_id);
    const remainingItem = (user === null || user === void 0 ? void 0 : user.cart)
        ? user.cart.filter((item) => !(item._id.toString() === productId && item.color === color))
        : [];
    const cartTotal = remainingItem.reduce((total, item) => total + item.totalPrice, 0);
    const updatedCart = yield models_1.UserModel.findByIdAndUpdate(_id, { cart: remainingItem, cartTotal }, { new: true });
    response.json(updatedCart);
}));
exports.removeAnItemFromCart = removeAnItemFromCart;
//Empty User Cart
const emptyUserCart = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = request.user;
    (0, helper_1.validateMongoDBId)(_id);
    const emptyCart = yield models_1.UserModel.findByIdAndUpdate(_id, { cart: [], cartTotal: 0, totalAfterDiscount: 0 }, { new: true });
    response.json(emptyCart);
}));
exports.emptyUserCart = emptyUserCart;
// Create Order
const createOrder = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentOption } = request.body;
    const { _id } = request.user;
    (0, helper_1.validateMongoDBId)(_id);
    if (paymentOption !== "card" || paymentOption === "cod") {
        response.json({
            message: "Order cannot be processed. Please select payment options",
        });
    }
    const user = yield models_1.UserModel.findById(_id);
    let userCart = user === null || user === void 0 ? void 0 : user.cart;
    console.log("userCart", userCart);
    const newOrder = yield new models_1.OrderModel({
        orderedProducts: userCart === null || userCart === void 0 ? void 0 : userCart.map((item) => ({
            _id: item._id,
            count: item.count,
            color: item.color,
        })),
        paymentIntent: {
            id: (0, uuid_1.v4)(),
            method: paymentOption,
            amount: user === null || user === void 0 ? void 0 : user.cartTotal,
            status: "Processing",
            created: Date.now(),
            currency: "usd",
        },
        paymentOption,
        orderBy: user === null || user === void 0 ? void 0 : user._id,
        orderStatus: "Processing",
    }).save();
    let updateCart = [];
    if (userCart) {
        updateCart = userCart.map((item) => ({
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } },
            },
        }));
    }
    //Empty User Cart
    yield models_1.UserModel.findByIdAndUpdate(_id, {
        cart: [],
        cartTotal: 0,
        totalAfterDiscount: 0,
    }, { new: true });
    // Update Product Quantity
    yield models_1.ProductModel.bulkWrite(updateCart, {});
    response.json({
        message: "Order processed successfully",
        newOrder,
    });
}));
exports.createOrder = createOrder;
//Get All Orders By A User
const getAllOrdersByAUser = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const userOrders = yield models_1.OrderModel.findOne({
        orderBy: id,
    })
        .populate("orderedProducts._id")
        .populate("orderBy")
        .exec();
    response.json(userOrders);
}));
exports.getAllOrdersByAUser = getAllOrdersByAUser;
//Get All Orders For A User
const getAllOrdersForUser = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.user;
    (0, helper_1.validateMongoDBId)(id);
    const userOrdersForUser = yield models_1.OrderModel.findOne({
        orderBy: id,
    })
        .populate("orderedProducts._id")
        .populate("orderBy")
        .exec();
    response.json(userOrdersForUser);
}));
exports.getAllOrdersForUser = getAllOrdersForUser;
//Get All Orders
const getAllOrders = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const allOrders = yield models_1.OrderModel.find()
        .populate("orderedProducts._id")
        .populate("orderBy")
        .exec();
    response.json(allOrders);
}));
exports.getAllOrders = getAllOrders;
//Update Order Status
const updateOrderStatus = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = request.body;
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const updateStatus = yield models_1.OrderModel.findByIdAndUpdate(id, { orderStatus: status, paymentIntent: { status: status } }, { new: true });
    response.json(updateStatus);
}));
exports.updateOrderStatus = updateOrderStatus;
//Delete Order
const deleteOrder = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const deleteOrder = yield models_1.OrderModel.findByIdAndDelete(id);
    response.json(deleteOrder);
}));
exports.deleteOrder = deleteOrder;
//# sourceMappingURL=index.js.map