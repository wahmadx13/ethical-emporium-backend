"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("../user");
class Rating {
}
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Rating.prototype, "star", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Rating.prototype, "comment", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => user_1.User, type: mongoose_1.default.Schema.Types.ObjectId }),
    __metadata("design:type", Object)
], Rating.prototype, "postedBy", void 0);
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Product.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true, lowercase: true }),
    __metadata("design:type", String)
], Product.prototype, "slug", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "brand", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Product.prototype, "quantity", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: [mongoose_1.default.Schema.Types.Mixed] }),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0, select: false }),
    __metadata("design:type", Number)
], Product.prototype, "sold", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: [mongoose_1.default.Schema.Types.Mixed] }),
    __metadata("design:type", Array)
], Product.prototype, "color", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: [mongoose_1.default.Schema.Types.Mixed] }),
    __metadata("design:type", Array)
], Product.prototype, "tags", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [Rating], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "ratings", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "totalRating", void 0);
__decorate([
    (0, typegoose_1.prop)({ timestamps: true }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ timestamps: true }),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
exports.Product = Product = __decorate([
    (0, typegoose_1.modelOptions)({
        options: {
            allowMixed: typegoose_1.Severity.ALLOW,
        },
    })
], Product);
//# sourceMappingURL=index.js.map