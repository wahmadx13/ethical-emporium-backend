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
// import { currentAuthenticatedUser } from "../../middleware/authMiddleware";
// import { generateRefreshToken } from "../../config/refreshToken";
import { generateToken } from "../../config/jwtToken";

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
const loginAdmin = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { email, password } = request.body;
    const findUser: DocumentType<User> | null = await UserModel.findOne({
      email,
    });
    if (findUser?.role?.toLowerCase() !== "admin") {
      throw new Error("Not Authorized");
    }
    await cognitoSigninUser({
      username: email,
      password,
    });
    const refreshToken = generateToken(findUser.cognitoUserId);
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
    const { username, userId, signInDetails } = await getCurrentUser();
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
    response.json({
      username,
      userId,
      signInDetails,
      accessToken,
      idToken,
      status: 200,
    });
  }
);

//Logout User
const logoutUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    await cognitoSignout();
    response.clearCookie("refreshToken", { httpOnly: true, secure: true });
    response.json({ status: 200, message: "User signed out successfully" });
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
          address: request?.body?.address,
        },
        { new: true }
      );

    if (updateUser) {
      response.json(updateUser);
    } else {
      response.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
  }
);

//Get All Users
const getAllUsers = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const getAllUsers: DocumentType<User>[] = await UserModel.find();
    response.json({ status: 200, getAllUsers });
  }
);

//Get A User
const getAUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    const getAUser: DocumentType<User> | null = await UserModel.findById(id);
    response.json({ status: 200, getAUser });
  }
);

//Delete A User
const deleteAUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const deleteAUser = await UserModel.findByIdAndDelete(id);
    await deleteUser();
    response.json({ status: 200, deleteAUser });
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
    response.json({ status: 200, message: "User unblocked", unblockUser });
  }
);

export {
  createUser,
  verifyUser,
  loginUser,
  loginAdmin,
  currentAuthenticatedUser,
  logoutUser,
  logoutUserOfAllDevices,
  updateUser,
  getAllUsers,
  getAUser,
  deleteAUser,
  updateUserPassword,
  forgotUserPassword,
  resetUserPassword,
  blockAUser,
  unblockAUser,
};
