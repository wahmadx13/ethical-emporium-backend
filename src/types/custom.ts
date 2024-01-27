import { DocumentType } from "@typegoose/typegoose";
import { User } from "../models/user";

export interface EmailSenderDataProps {
  to: string;
  from?: string;
  subject: string;
  text: string;
  htm: string;
}

// Authentication Types

// Sign up
export interface SignupParameters {
  username: string;
  name: string;
  email: string;
  password: string;
  phone_number: string;
  role?: string;
}

// Post Signup
export interface CognitoSignUpResult {
  isSignUpComplete: boolean;
  userId: string | undefined;
  nextStep: {
    signUpStep: string;
  };
}

//Verify User
export interface CognitoSignUpVerifyResult {
  isSignUpComplete: boolean;
  nextStep: {};
}

//SignIn
export interface CognitoSignInResult {
  isSignedIn: boolean;
  nextStep: {
    signInStep: string;
  };
}

export interface CognitoCurrentAuthUser {
  userId: string;
  signInDetails?: {
    loginId?: string;
    authFlowType?: string;
  };
}
