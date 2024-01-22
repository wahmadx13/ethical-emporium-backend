import {
  prop,
  getModelForClass,
  Ref,
  modelOptions,
} from "@typegoose/typegoose";
import mongoose, { Types } from "mongoose";
import { User } from "../userModel";

class Product {
  @prop({ required: true, trim: true })
  title!: string;

  @prop({ required: true, unique: true, lowercase: true })
  slug!: string;

  @prop({ required: true })
  description!: string;

  @prop({ required: true })
  price!: number;

  @prop({ required: true })
  brand!: string;

  @prop({ required: true })
  category!: string;

  @prop({ required: true })
  quantity!: number;

  @prop({ type: [mongoose.Schema.Types.Mixed] })
  images?: { url: string; public_id: string }[];

  @prop({ default: 0, select: false })
  sold?: number;

  @prop({ type: [mongoose.Schema.Types.Mixed] })
  color?: string[];

  @prop({ type: [mongoose.Schema.Types.Mixed] })
  tags?: string[];

  @prop({
    ref: () => User,
    type: () => [{ star: Number, comment: String, postedBy: Types.ObjectId }],
  })
  ratings?: { star: number; comment: string; postedBy: Ref<User> }[];

  @prop({ default: 0 })
  totalRating?: number;

  @prop({ timestamps: true })
  createdAt?: Date;

  @prop({ timestamps: true })
  updatedAt?: Date;
}

const ProductModel = getModelForClass(Product);

export { Product, ProductModel };
