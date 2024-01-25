import { prop, modelOptions } from "@typegoose/typegoose";

enum ColorOptions {
  red = "red",
  white = "white",
  violet = "violet",
  black = "black",
  silver = "silver",
  pink = "pink",
  purple = "purple",
  orange = "orange",
  indigo = "indigo",
  blue = "blue",
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Color {
  @prop({ required: true, unique: true, index: true, enum: ColorOptions })
  title!: string;
}
