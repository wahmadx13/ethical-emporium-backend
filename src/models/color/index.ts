import { prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Color {
  @prop({ required: true, unique: true, index: true })
  title!: string;
}
