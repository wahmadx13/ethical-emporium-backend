import {
  signUp,
  confirmSignUp,
  type ConfirmSignUpInput,
} from "aws-amplify/auth";
import { DocumentType } from "@typegoose/typegoose";
import { SignupParameters } from "../../types/custom";
import { User, UserModel } from "../../models/userModel";

//Sign Up
export const cognitoSignup = async (data: SignupParameters) => {
  const { username, password, email, phone_number, name } = data;
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email,
          phone_number,
          name,
        },
      },
    });
    console.log("isSignUpComplete", isSignUpComplete);
    console.log("userId", userId);
    console.log("nextStep", nextStep);
  } catch (err) {
    throw new Error(`Error while signing up: ${err}`);
  }
};

//Verify User
export const cognitoVerifyUser = async ({
  username,
  confirmationCode,
}: ConfirmSignUpInput) => {
  console.log("username", username);
  console.log("confirmationCode", confirmationCode);
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username,
      confirmationCode,
    });
    console.log("isSignUpCompleteV", isSignUpComplete);
    console.log("nextStepV", nextStep);
  } catch (err) {
    throw new Error(`An error occurred during confirmation: ${err}`);
  }
};
