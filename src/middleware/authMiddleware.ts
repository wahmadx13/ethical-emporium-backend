import { Request, Response, NextFunction } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User, UserModel } from "../models/userModel";

export const authMiddleware = expressAsyncHandler(
  async (request: Request, Response: Response, next: NextFunction) => {
    let token;
    console.log("request?.headers", request?.headers?.authorization);
    if (request?.headers?.authorization?.startsWith("Bearer")) {
      token = request.headers.authorization.split(" ")[1];
      try {
        if (token) {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
          ) as DecodedToken;
          const user: DocumentType<User> | null = await UserModel.findById(
            decoded?.id
          );
          request.user = user;
          next();
        }
      } catch (err) {
        throw new Error("Not authorized or token expired. Please login again");
      }
    } else {
      throw new Error("There is no token attached to the header");
    }
  }
);
