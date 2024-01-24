import { Request, Response, NextFunction } from "express";
import { DocumentType } from "@typegoose/typegoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getCurrentUser } from "aws-amplify/auth";
import { CognitoCurrentAuthUser } from "../types/custom";
import { User } from "../models/userModel";
import { UserModel } from "../models";

export const currentAuthenticatedUser =
  async (): Promise<CognitoCurrentAuthUser> => {
    try {
      const { userId, signInDetails } = await getCurrentUser();
      return { userId, signInDetails };
    } catch (err) {
      throw new Error(`No authenticated user exist: ${err}`);
    }
  };

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
