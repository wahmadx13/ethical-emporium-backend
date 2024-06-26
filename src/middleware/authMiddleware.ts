import { Request, Response, NextFunction } from "express";
import { DocumentType } from "@typegoose/typegoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user";
import { UserModel } from "../models";

export const authMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let token;
  if (request?.headers.authorization?.startsWith("Bearer")) {
    token = request.headers.authorization.split(" ")[1];
    if (token) {
      const decoded = (await jwt.verify(
        token,
        process.env.JWT_SECRET!
      )) as JwtPayload;
      const user: DocumentType<User> | null = await UserModel.findOne({
        cognitoUserId: decoded?.id,
      });
      request.user = await user?.save();
      next();
    }
  } else {
    throw new Error("There is no token attached to header");
  }
};
