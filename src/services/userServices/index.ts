import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { VerifyErrors, JwtPayload } from "jsonwebtoken";
import { UserModel, User } from "../../models/userModel";
import { generateRefreshToken } from "../../config/refreshToken";
import { generateToken } from "../../config/jwtToken";
import { jwtSecret } from "../../utils/constants";
import { validateMongoDBId } from "../../utils/helper";

//Creating User
const createUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const email: string = request.body.email;

    const findUser: DocumentType<User> | null = await UserModel.findOne({
      email,
    });

    if (!findUser) {
      const newUser: DocumentType<User> = await UserModel.create(request.body);
      response.json(newUser);
    } else {
      throw new Error("User already exists");
    }
  }
);

//Login user
const loginUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { email, password } = request.body;
    const findUser: DocumentType<User> | null = await UserModel.findOne({
      email,
    });

    const passwordMatched = await findUser?.isPasswordMatched(password);

    if (findUser && passwordMatched) {
      const refreshToken = generateRefreshToken(findUser?._id.toString());
      await UserModel.findByIdAndUpdate(
        findUser?.id,
        { refreshToken },
        { new: true }
      );

      response.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });

      response.json({
        name: findUser?.name,
        email: findUser.email,
        phone_number: findUser?.phoneNumber,
        token: generateToken(findUser?._id.toString()),
      });
    }
  }
);

//Refresh Token
const handleRefreshToken = expressAsyncHandler(
  async (request: Request, response: Response) => {
    const cookie = request.cookies;
    const refreshToken = cookie.refreshToken;
    console.log("refreshToken", refreshToken);

    if (!refreshToken) {
      throw new Error("No Refresh Token in cookies");
    }

    const user: DocumentType<User> | null = await UserModel.findOne({
      refreshToken,
    });

    if (!user) {
      throw new Error("No refresh token present in db or not matched");
    }

    if (!jwtSecret) {
      throw new Error("Jwt secret is not defined");
    }

    jwt.verify(refreshToken, jwtSecret, function (
      err: VerifyErrors | null,
      decoded: JwtPayload | undefined
    ) {
      if (err || !decoded || user.id !== decoded.id) {
        throw new Error("There is something wrong with the refresh token");
      }

      const accessToken = generateToken(user?._id.toString());
      response.json({ accessToken });
    } as jwt.VerifyCallback);
  }
);

//Logout User
const logoutUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const cookie = request.cookies;
    const refreshToken = cookie.refreshToken;

    if (!refreshToken) {
      throw new Error("No refresh token in cookie");
    }

    const user: DocumentType<User> | null = await UserModel.findOne({
      refreshToken,
    });

    if (!user) {
      response.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });

      response.status(401).json({
        message: "User not found or already logged out.",
      });
    } else {
      await UserModel.findOneAndUpdate({ refreshToken }, { refreshToken: "" });

      response.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });

      response.json({
        message: "User logged out successfully!",
      });
    }
  }
);

//Update User
const updateUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { _id } = request.user;
    validateMongoDBId(_id as string);
    console.log("_id", _id);

    const updateUser: DocumentType<User> | null =
      await UserModel.findByIdAndUpdate(
        _id,
        {
          name: request?.body?.name,
          email: request?.body?.email,
          phoneNumber: request?.body?.phoneNumber,
          address: request?.body?.address,
        },
        { new: true }
      );

    if (updateUser) {
      response.json(updateUser);
    } else {
      response.status(404).json({
        message: "User not found",
      });
    }
  }
);

export { createUser, loginUser, logoutUser, handleRefreshToken, updateUser };
