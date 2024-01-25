import { prop, modelOptions, Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Product } from "../product";
import { User } from "../userModel";

class CartProduct {
  @prop({ ref: () => Product, type: mongoose.Schema.Types.ObjectId })
  product?: Ref<Product>;

  @prop()
  count?: number;

  @prop()
  color?: string;

  @prop()
  price?: number;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Cart {
  @prop({ type: () => [CartProduct], default: [] })
  products?: CartProduct[];

  @prop()
  cartTotal?: number;

  @prop()
  totalAfterDiscount?: number;

  @prop({ ref: () => User, type: mongoose.Schema.Types.ObjectId })
  orderBy?: Ref<User>;
}
