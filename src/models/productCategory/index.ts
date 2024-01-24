import { prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class ProductCategory {
  @prop({ required: true, unique: true, index: true })
  title!: string;
}
