import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
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

  @prop({ required: true, type: () => [{ url: String }] })
  images!: { url: string }[];

  @prop({ default: 0, select: false })
  sold?: number;

  @prop({ default: [] })
  color?: string[];

  @prop({ default: [] })
  tags?: string[];

  @prop({
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
