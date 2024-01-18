import {
  CookieStorage,
  defaultStorage,
  sessionStorage,
} from "aws-amplify/utils";
import { Amplify } from "aws-amplify";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { authConfig } from "../utils/helper";

Amplify.configure({
  Auth: authConfig,
});

//Default Browser Local Storage
cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);

//Cookie Storage
cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());

//Session Storage
cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage);
