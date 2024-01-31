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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_1 = __importStar(require("mongoose"));
const user_1 = require("../user");
let Blog = class Blog {
};
exports.Blog = Blog;
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true, index: true })
], Blog.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true, lowercase: true })
], Blog.prototype, "slug", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true })
], Blog.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true })
], Blog.prototype, "category", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 })
], Blog.prototype, "numberOfViews", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false })
], Blog.prototype, "isLiked", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false })
], Blog.prototype, "isDisliked", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => user_1.User, type: [mongoose_1.Types.ObjectId] })
], Blog.prototype, "likes", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => user_1.User, type: [mongoose_1.Types.ObjectId] })
], Blog.prototype, "dislikes", void 0);
__decorate([
    (0, typegoose_1.prop)({
        type: [mongoose_1.default.Schema.Types.Mixed],
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD9vD8FA01ESWdXO9RC6YIcqoTNq6zu3ra8bbQd70zcA&s",
    })
], Blog.prototype, "images", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "Admin" })
], Blog.prototype, "author", void 0);
exports.Blog = Blog = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true,
            toJSON: { virtuals: true },
            toObject: { virtuals: true },
        },
        options: {
            allowMixed: typegoose_1.Severity.ALLOW,
        },
    })
], Blog);
