import { prop, Ref, modelOptions, Severity } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class BlogCategory {
  @prop({ required: true, unique: true, index: true })
  title!: string;
}
