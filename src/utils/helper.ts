import { Request, Response } from "express";
import { type ResourcesConfig } from "aws-amplify";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import expressAsyncHandler from "express-async-handler";
import { EmailSenderDataProps } from "../types/custom";

export const validateMongoDBId = (id: string) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error("This id is not valid or not found");
  }
};

export const sendEmail = async (data: EmailSenderDataProps): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    debug: true,
    logger: true,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  let info = await transporter.sendMail({
    from: '"Hey👻"noreply@ethical-emporium.com', // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.htm, // html body
  });
  console.log("info", info);
};

export const authConfig: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: process.env.CUSTOMER_USER_POOL_ID!,
    userPoolClientId: process.env.CUSTOMER_USER_POOL_CLIENT_ID!,
  },
};
