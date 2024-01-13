import { Request, Response, NextFunction } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User, UserModel } from "../models/userModel";
import { jwtSecret } from "../utils/constants";

export const authMiddleware = expressAsyncHandler(
  async (request: Request, Response: Response, next: NextFunction) => {
    let token;
    if (request?.headers?.authorization?.startsWith("Bearer")) {
      token = request.headers.authorization.split(" ")[1];
      try {
        if (token && jwtSecret) {
          const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
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
