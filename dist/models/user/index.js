"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.CartProduct = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_1 = __importStar(require("mongoose"));
const product_1 = require("../product");
class CartProduct {
}
exports.CartProduct = CartProduct;
__decorate([
    (0, typegoose_1.prop)({ ref: () => product_1.Product, type: mongoose_1.default.Schema.ObjectId }),
    __metadata("design:type", Object)
], CartProduct.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], CartProduct.prototype, "count", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CartProduct.prototype, "color", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], CartProduct.prototype, "singleItemPrice", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], CartProduct.prototype, "totalPrice", void 0);
class User {
}
exports.User = User;
__decorate([
    (0, typegoose_1.prop)({ required: true, type: mongoose_1.Types.ObjectId }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], User.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "user" }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], User.prototype, "cognitoUserId", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isBlocked", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [CartProduct], default: [] }),
    __metadata("design:type", Array)
], User.prototype, "cart", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "cartTotal", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "totalAfterDiscount", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => product_1.Product, type: mongoose_1.Types.ObjectId }),
    __metadata("design:type", Array)
], User.prototype, "wishList", void 0);
__decorate([
    (0, typegoose_1.prop)({ timestamps: true }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ timestamps: true }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
//# sourceMappingURL=index.js.map