import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import { User } from "../../models/user";
import { UserModel } from "../../models";
import { validateMongoDBId } from "../../utils/helper";
import {
  cognitoGlobalSignout,
  cognitoSigninUser,
  cognitoSignout,
  cognitoSignup,
  cognitoVerifyUser,
  handleConfirmResetPassword,
  handlePasswordReset,
  handleUpdatePassword,
} from "../../aws/cognito/authServices";
import { deleteUser, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { generateToken } from "../../config/jwtToken";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { generateRefreshToken } from "../../config/refreshToken";

//Creating User
const createUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { email, name, phoneNumber, password } = request.body;
    const existingUser: DocumentType<User> | null = await UserModel.findOne({
      email,
    });

    try {
      if (existingUser) {
        response.json({
          status: 500,
          message: `User exists with current email: ${email}`,
        });
      } else {
        await cognitoSignup({
          username: email,
          name,
          password,
          email,
          phone_number: phoneNumber,
        });
        response.json({
          status: 200,
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

    response.json({ status: 200, message: "User verified" });
  }
);

//Login user
const loginUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { email, password } = request.body;
    const findUser: DocumentType<User> | null = await UserModel.findOne({
      email,
    });
    if (!findUser?.isBlocked) {
      await cognitoSigninUser({
        username: email,
        password,
      });
      const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      // console.log("accessToken: ", accessToken, "idToken: ", idToken);
      const refreshToken = generateToken(accessToken?.payload?.sub);

      response.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60,
      });

      response.json({
        status: 200,
        message: "Signed in successfully",
        name: findUser?.name,
        email: findUser?.email,
        phoneNumber: findUser?.phoneNumber,
        refreshToken,
      });
    } else {
      throw new Error("Invalid Credentials or user blocked by admin");
    }
  }
);

//Login Admin 
const loginAdmin = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { email, password } = request.body;
    const findUser: DocumentType<User> | null = await UserModel.findOne({
      email,
    });
    if (findUser?.role?.toLowerCase() !== "admin") {
      response.json({
        message: "Not Authorized. You are not an admin",
        status: 401,
      });
      return;
    }
    await cognitoSigninUser({
      username: email,
      password,
    });
    const refreshToken = generateToken(findUser?.cognitoUserId);

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60,
    });

    response.json({
      status: 200,
      message: "Signed in successfully",
      name: findUser?.name,
      email: findUser?.email,
      phoneNumber: findUser?.phoneNumber,
      refreshToken,
    });
  }
);

//Get Current Authenticated User
const currentAuthenticatedUser = expressAsyncHandler(
  async (request: Request, response: Response) => {
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};

    response.json({
      accessToken,
      idToken,
      status: 200,
    });
  }
);

// Refresh Token
const refreshUserToken = expressAsyncHandler(
  async (request: Request, response: Response) => {
    const refreshToken = request.cookies?.refreshToken;
    const decoded = (await jwt.verify(
      refreshToken,
      process.env.JWT_SECRET!
    )) as JwtPayload;
    const user = await UserModel.findOne({ cognitoUserId: decoded.id });
    request.user = user?.save();

    if (!refreshToken || !user?.id) {
      throw new Error(
        "No refresh token in cookies or no authenticated user exists. Please signin again"
      );
    } else {
      jwt.verify(refreshToken, process.env.JWT_SECRET!, function (
        err: VerifyErrors | null,
        decoded: JwtPayload | undefined
      ) {
        if (err || user.id !== decoded?.id) {
          throw new Error("There is something wrong with refresh token");
        } else {
          const accessToken = generateRefreshToken(user.id);
          response.json({ accessToken, status: 200 });
        }
      } as jwt.VerifyCallback);
    }
  }
);

//Logout User
const logoutUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    await cognitoSignout();

    response.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    response.json({
      status: 200,
      message: "User signed out successfully",
    });
  }
);

//Signout of all devices
const logoutUserOfAllDevices = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    await cognitoGlobalSignout();
    response.json({
      status: 200,
      message: "User signed out of all devices successfully",
    });
  }
);

//Update User Password
const updateUserPassword = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { oldPassword, newPassword } = request.body;
    await handleUpdatePassword({
      oldPassword,
      newPassword,
    });
    response.json({ status: 200, message: "Password updated successfully" });
  }
);

//Forgotten User Password
const forgotUserPassword = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { email } = request.body;
    const user: DocumentType<User> | null = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("The email is not associated with any user");
    } else {
      const code = handlePasswordReset(email);
      response.json({ status: 200, code });
    }
  }
);

//Reset User Password
const resetUserPassword = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { email, code, password } = request.body;
    await handleConfirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword: password,
    });
    response.json({ status: 200, message: "Password updated successfully" });
  }
);

export {
  createUser,
  verifyUser,
  loginUser,
  loginAdmin,
  refreshUserToken,
  currentAuthenticatedUser,
  logoutUser,
  logoutUserOfAllDevices,
  updateUserPassword,
  forgotUserPassword,
  resetUserPassword,
};
