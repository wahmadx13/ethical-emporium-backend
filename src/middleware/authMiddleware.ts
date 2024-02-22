import { Request, Response, NextFunction } from "express";
import { DocumentType } from "@typegoose/typegoose";
import { jwtDecode } from "jwt-decode";
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
      console.log("token", token);
      const decoded = jwtDecode(token);
      console.log("decoded", decoded);
      const user: DocumentType<User> | null = await UserModel.findOne({
        cognitoUserId: decoded.sub,
      });
      request.user = await user?.save();
      next();
    }
  } else {
    throw new Error("There is no token attached to header");
  }
};
