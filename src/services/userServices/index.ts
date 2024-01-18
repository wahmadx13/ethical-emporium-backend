import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { VerifyErrors, JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import { UserModel, User } from "../../models/userModel";
import { generateRefreshToken } from "../../config/refreshToken";
import { generateToken } from "../../config/jwtToken";
import { sendEmail, validateMongoDBId } from "../../utils/helper";
import {
  cognitoGlobalSignout,
  cognitoSigninUser,
  cognitoSignout,
  cognitoSignup,
  cognitoVerifyUser,
} from "../../aws/cognito/authServices";

//Creating User
const createUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { email, name, phoneNumber, password } = request.body;
    const existingUser: DocumentType<User> | null = await UserModel.findOne({
      email,
    });

    try {
      if (existingUser) {
        response.json({ message: `User exists with current email: ${email}` });
      } else {
        await cognitoSignup({
          username: email,
          name,
          password,
          email,
          phone_number: phoneNumber,
        });
        response.json({
          message: `A six digit code is sent to: ${email}. Please verify email address`,
        });
      }
    } catch (err) {
      throw new Error(`The following error occurred: ${err}`);
    }
  }
);

//Verifying User
const verifyUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { email, code } = request.body;
    await cognitoVerifyUser({
      username: email,
      confirmationCode: code,
    });

    response.json({ message: "User verified" });
  }
);

//Login user
const loginUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { email, password } = request.body;
    const findUser: DocumentType<User> | null = await UserModel.findOne({
      email,
    });

    if (findUser && !findUser.isBlocked) {
      const userSignedIn = await cognitoSigninUser({
        username: email,
        password,
      });
      response.json(userSignedIn);
    } else {
      throw new Error("Invalid email or password");
    }
  }
);

//Refresh Token
const handleRefreshToken = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
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

    jwt.verify(refreshToken, process.env.JWT_SECRET!, function (
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
    await cognitoSignout();
    response.json({ message: "User signed out successfully" });
  }
);

//Signout of all devices
const logoutUserOfAllDevices = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    await cognitoGlobalSignout();
    response.json({ message: "User signed out of all devices successfully" });
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

//Get All Users
const getAllUsers = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const getAllUsers: DocumentType<User>[] = await UserModel.find();
    response.json(getAllUsers);
  }
);

//Get A User
const getAUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    const getAUser: DocumentType<User> | null = await UserModel.findById(id);
    response.json(getAUser);
  }
);

//Delete A User
const deleteAUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const deleteAUser = await UserModel.findByIdAndDelete(id);
    response.json(deleteAUser);
  }
);

//Update User Password
const updateUserPassword = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { _id } = request.user;
    const { password } = request.body;
    validateMongoDBId(_id);
    const user: DocumentType<User> | null = await UserModel.findById(_id);
    if (user && password) {
      // user.password = password;
      const updateUserPassword = await user.save();
      response.json(updateUserPassword);
    } else {
      response.json(user);
    }
  }
);

//Forgotten User Password
const forgotUserPasswordToken = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { email } = request.body;
    const user: DocumentType<User> | null = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("The email is not associated with any user");
    } else {
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetURL = `Hi! Please follow this link to reset Your Password. This link is valid for 10 minutes from now. <a href='http://localhost:5000/api/user/forgot-password/${token}'>Click Here</a>`;
      const data = {
        to: email,
        text: "Hey Dear User",
        subject: "Forgot Password Link",
        htm: resetURL,
      };
      sendEmail(data);
      response.json(token);
    }
  }
);

//Reset User Password
const resetUserPassword = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { token } = request.params;
    const { password } = request.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user: DocumentType<User> | null = await UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() + 10 * 60 * 1000 },
    });
    if (!user) {
      throw new Error("Token expired. Please try again");
    } else {
      // user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      response.json(user);
    }
  }
);

//Block User
const blockAUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const blockUser: DocumentType<User> | null =
      await UserModel.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
    response.json({ message: "User Blocked", blockUser });
  }
);

//Unblock A User
const unblockAUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const unblockUser: DocumentType<User> | null =
      await UserModel.findByIdAndUpdate(
        id,
        { isBlocked: false },
        { new: true }
      );
    response.json({ message: "User unblocked", unblockUser });
  }
);

export {
  createUser,
  verifyUser,
  loginUser,
  logoutUser,
  logoutUserOfAllDevices,
  handleRefreshToken,
  updateUser,
  getAllUsers,
  getAUser,
  deleteAUser,
  updateUserPassword,
  forgotUserPasswordToken,
  resetUserPassword,
  blockAUser,
  unblockAUser,
};
