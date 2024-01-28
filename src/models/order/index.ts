import { prop, Ref, modelOptions, Severity } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Product } from "../product";
import { User } from "../user";

enum StatusOptions {
  notProcessed = "Not Processed",
  COD = "Cash On Delivery",
  processing = "Processing",
  dispatched = "Dispatched",
  cancelled = "Cancelled",
  delivered = "Delivered",
}

enum payIntent {
  card = "card",
}

class OrderedProducts {
  @prop({ ref: () => Product, type: mongoose.Schema.ObjectId })
  _id?: Ref<Product>;

  @prop()
  count?: number;

  @prop()
  color?: string;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Order {
  @prop({ type: () => [OrderedProducts] })
  orderedProducts?: OrderedProducts[];

  @prop({ required: true, enum: payIntent, default: payIntent.card })
  paymentOption!: string;

  @prop()
  paymentIntent?: {};

  @prop({ enum: StatusOptions, default: StatusOptions.notProcessed })
  orderStatus?: string;

  @prop({ ref: () => User, type: () => mongoose.Schema.ObjectId })
  orderBy?: Ref<User>;
}
