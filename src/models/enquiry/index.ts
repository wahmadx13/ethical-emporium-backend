import { prop, modelOptions } from "@typegoose/typegoose";

enum StatusOptions {
  submitted = "Submitted",
  contacted = "Contacted",
  inprogress = "In Progress",
  resolved = "Resolved",
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Enquiry {
  @prop({ required: true })
  name!: string;

  @prop({ required: true, unique: true })
  email!: string;

  @prop({ required: true, unique: true })
  mobile!: string;

  @prop({ required: true })
  comment!: string;

  @prop({ default: StatusOptions.submitted })
  status?: string;
}
