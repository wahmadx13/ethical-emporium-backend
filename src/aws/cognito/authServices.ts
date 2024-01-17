import { signUp } from "aws-amplify/auth";
import { SignupParameters } from "../../types/custom";

//Sign Up
export const cognitoSignup = async (data: SignupParameters) => {
  const { username, password, email, phone_number, name } = data;
  try {
    await signUp({
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
  } catch (err) {
    throw new Error(`Error while signing up: ${err}`);
  }
};
