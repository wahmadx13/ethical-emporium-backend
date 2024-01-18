import {
  signUp,
  confirmSignUp,
  type ConfirmSignUpInput,
  signIn,
  type SignInInput,
  signOut,
} from "aws-amplify/auth";
import { SignupParameters } from "../../types/custom";

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

//Signin User
export const cognitoSigninUser = async ({
  username,
  password,
}: SignInInput) => {
  try {
    const { isSignedIn, nextStep } = await signIn({ username, password });
    console.log("isSignedIn", isSignedIn);
    console.log("nextStep", nextStep);
  } catch (err) {
    throw new Error(`An error occurred during signin process: ${err}`);
  }
};

//Signout User
export const cognitoSignout = async () => {
  try {
    await signOut();
    console.log("Signed out of all devices");
  } catch (err) {
    throw new Error(`The following error occurred during the process`);
  }
};

//Signout of all devices
export const cognitoGlobalSignout = async () => {
  try {
    await signOut({ global: true });
  } catch (err) {
    throw new Error(`An error occurred during the process: ${err}`);
  }
};
