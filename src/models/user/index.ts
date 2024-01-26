import { prop, Ref } from "@typegoose/typegoose";
import mongoose, { Types } from "mongoose";
import { Product } from "../product";

export class CartProduct {
  @prop({ ref: () => Product, type: mongoose.Schema.ObjectId })
  _id?: Ref<Product>;

  @prop()
  count?: Number;

  @prop()
  color?: string;

  @prop()
  singleItemPrice?: Number;

  @prop()
  totalPrice?: number;
}
export class User {
  @prop({ required: true, type: Types.ObjectId })
  _id!: Types.ObjectId;

  @prop({ required: true, index: true })
  name!: string;

  @prop({ required: true, unique: true })
  email!: string;

  @prop({ required: true, unique: true })
  phoneNumber!: string;

  @prop({ default: "user" })
  role?: string;

  @prop()
  address?: string;

  @prop()
  cognitoUserId?: string;

  @prop({ default: false })
  isBlocked?: boolean;

  @prop({ type: () => [CartProduct], default: [] })
  cart?: CartProduct[];

  @prop({ default: 0 })
  cartTotal?: number;

  @prop({ default: 0 })
  totalAfterDiscount?: number;

  @prop({ ref: () => Product, type: Types.ObjectId })
  wishList?: Ref<Product>[];

  @prop({ timestamps: true })
  createdAt?: Date;

  @prop({ timestamps: true })
  updatedAt?: Date;
}
