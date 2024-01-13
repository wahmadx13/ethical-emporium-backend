import { pre, prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

@pre<User>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
})
class User {
  @prop({ required: true, index: true })
  name!: string;

  @prop({ required: true, unique: true })
  email!: string;

  @prop({ required: true, unique: true })
  phoneNumber!: string;

  @prop({ required: true })
  password!: string;

  @prop({ default: "user" })
  role?: string;

  @prop()
  address?: string;

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

  async isPasswordMatched(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }

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
