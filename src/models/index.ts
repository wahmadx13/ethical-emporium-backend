import { getModelForClass } from "@typegoose/typegoose";
import { User } from "./userModel";
import { Product } from "./product";
import { Blog } from "./blog";
import { BlogCategory } from "./blogCategory";
import { Brand } from "./brand";

export const UserModel = getModelForClass(User);
export const ProductModel = getModelForClass(Product);
export const BlogModel = getModelForClass(Blog);
export const BlogCategoryModel = getModelForClass(BlogCategory);
export const BrandModel = getModelForClass(Brand);
