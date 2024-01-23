import { getModelForClass } from "@typegoose/typegoose";
import { User } from "./userModel";
import { Product } from "./product";

export const UserModel = getModelForClass(User);
export const ProductModel = getModelForClass(Product);
