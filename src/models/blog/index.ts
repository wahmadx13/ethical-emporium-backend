import { prop, Ref, modelOptions, Severity } from "@typegoose/typegoose";
import mongoose, { Types } from "mongoose";
import { User } from "../user";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Blog {
  @prop({ required: true, unique: true, index: true })
  title!: string;

  @prop({ required: true, unique: true, lowercase: true })
  slug!: string;

  @prop({ required: true })
  description!: string;

  @prop({ required: true })
  category!: string;

  @prop({ default: 0 })
  numberOfViews?: number;

  @prop({ default: false })
  isLiked?: boolean;

  @prop({ default: false })
  isDisliked?: boolean;

  @prop({ ref: () => User, type: [Types.ObjectId] })
  likes?: Ref<User>[];

  @prop({ ref: () => User, type: [Types.ObjectId] })
  dislikes?: Ref<User>[];

  @prop({ type: [mongoose.Schema.Types.Mixed] })
  tags?: string[];

  @prop({
    type: [mongoose.Schema.Types.Mixed],
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD9vD8FA01ESWdXO9RC6YIcqoTNq6zu3ra8bbQd70zcA&s",
  })
  images?: { url: string; public_id: string }[];

  @prop({ default: "Admin" })
  author?: string;
}
