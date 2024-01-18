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

  @prop()
  refreshToken?: string;

  @prop()
  passwordChangedAt?: Date;

  @prop()
  passwordResetToken?: string;

  @prop()
  passwordResetExpires?: Date;

  @prop({ timestamps: true })
  createdAt?: Date;

  @prop({ timestamps: true })
  updatedAt?: Date;

  async createPasswordResetToken(): Promise<string> {
    const resetToken = crypto.randomBytes(32).toString("hex");

    const expirationTimestamp = Date.now() + 30 * 60 * 1000;

    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = new Date(expirationTimestamp);
    return resetToken;
  }
}

const UserModel = getModelForClass(User);

export { User, UserModel };
