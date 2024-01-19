import {
  signUp,
  confirmSignUp,
  type ConfirmSignUpInput,
  signIn,
  type SignInInput,
  signOut,
  resetPassword,
  type ResetPasswordOutput,
  confirmResetPassword,
  type ConfirmResetPasswordInput,
  updatePassword,
  type UpdatePasswordInput,
} from "aws-amplify/auth";
import { SignupParameters } from "../../types/custom";

//Sign Up
export const cognitoSignup = async (data: SignupParameters): Promise<void> => {
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
}: ConfirmSignUpInput): Promise<void> => {
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
}: SignInInput): Promise<void> => {
  try {
    const { isSignedIn, nextStep } = await signIn({ username, password });
    console.log("isSignedIn", isSignedIn);
    console.log("nextStep", nextStep);
  } catch (err) {
    throw new Error(`An error occurred during signin process: ${err}`);
  }
};

//Signout User
export const cognitoSignout = async (): Promise<void> => {
  try {
    await signOut();
    console.log("Signed out of all devices");
  } catch (err) {
    throw new Error(`The following error occurred during the process`);
  }
};

//Signout of all devices
export const cognitoGlobalSignout = async (): Promise<void> => {
  try {
    await signOut({ global: true });
  } catch (err) {
    throw new Error(`An error occurred during the process: ${err}`);
  }
};

//Reset Password
export const handlePasswordReset = async (username: string): Promise<void> => {
  try {
    const output = await resetPassword({ username });
    handleResetPasswordNextStep(output);
  } catch (err) {
    throw new Error(`An error occurred during the process: ${err}`);
  }
};

export const handleResetPasswordNextStep = async (
  output: ResetPasswordOutput
): Promise<void> => {
  const { nextStep } = output;
  switch (nextStep.resetPasswordStep) {
    case "CONFIRM_RESET_PASSWORD_WITH_CODE":
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      console.log(
        `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
      );
      break;
    case "DONE":
      console.log("Password reset successfully");
      break;
  }
};

//Confirm Reset Password Code
export const handleConfirmResetPassword = async ({
  username,
  confirmationCode,
  newPassword,
}: ConfirmResetPasswordInput): Promise<void> => {
  try {
    await confirmResetPassword({ username, confirmationCode, newPassword });
  } catch (err) {
    throw new Error(`Error during reset password: ${err}`);
  }
};

//Update Password
export const handleUpdatePassword = async ({
  oldPassword,
  newPassword,
}: UpdatePasswordInput): Promise<void> => {
  try {
    await updatePassword({ oldPassword, newPassword });
  } catch (err) {
    throw new Error(`Error occurred: ${err}`);
  }
};