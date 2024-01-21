import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { UserModel } from "../models/userModel";

export const isAdmin = expressAsyncHandler(
  async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    const { email } = request.user;
    const admin = await UserModel.findOne({ email });
    if (admin?.role?.toLowerCase() !== "admin") {
      throw new Error("You are not an Admin");
    } else {
      next();
    }
  }
);
