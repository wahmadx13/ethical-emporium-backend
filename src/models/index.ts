import { getModelForClass } from "@typegoose/typegoose";
import { User } from "./userModel";
import { Product } from "./product";
import { Blog } from "./blog";
import { BlogCategory } from "./blogCategory";
import { Brand } from "./brand";
import { ProductCategory } from "./productCategory";

export const UserModel = getModelForClass(User);
export const ProductModel = getModelForClass(Product);
export const BlogModel = getModelForClass(Blog);
export const BlogCategoryModel = getModelForClass(BlogCategory);
export const BrandModel = getModelForClass(Brand);
export const ProductCategoryModel = getModelForClass(ProductCategory);
