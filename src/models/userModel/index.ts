import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import crypto from "crypto";
class User {
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

  @prop({ type: () => [Types.ObjectId], default: [] })
  cart?: Types.ObjectId[];

  @prop({ timestamps: true })
  createdAt?: Date;

  @prop({ timestamps: true })
  updatedAt?: Date;
}

const UserModel = getModelForClass(User);

export { User, UserModel };
