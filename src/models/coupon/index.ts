import { prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Coupon {
  @prop({ required: true, unique: true, uppercase: true })
  name!: string;

  @prop({ required: true })
  expiry!: Date;

  @prop({ required: true })
  discount!: number;
}
