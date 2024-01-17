import { Amplify } from "aws-amplify";

const userAmplifyConfiguration = () => {
  console.log(
    "User amplify loaded successfully",
    process.env.CUSTOMER_USER_POOL_ID
  );
  Amplify.configure({
    Auth: {
      Cognito: {
        //  Amazon Cognito User Pool ID
        userPoolId: process.env.CUSTOMER_USER_POOL_ID!,
        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolClientId: process.env.CUSTOMER_USER_POOL_CLIENT_ID!,
        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: process.env.CUSTOMER_USER_POOL_IDENTITY_POOL_ID!,
        // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
        // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
        signUpVerificationMethod: "code", // 'code' | 'link'
        loginWith: {
          // OPTIONAL - Hosted UI configuration
          oauth: {
            domain: "your_cognito_domain",
            scopes: [
              "phone",
              "email",
              "profile",
              "openid",
              "aws.cognito.signin.user.admin",
            ],
            redirectSignIn: [process.env.CUSTOMER_REDIRECT_LOGIN_URL!],
            redirectSignOut: [process.env.CUSTOMER_REDIRECT_LOGOUT_URL!],
            responseType: "code", // or 'token', note that REFRESH token will only be generated when the responseType is code
          },
        },
      },
    },
  });
};

// You can get the current config object
// const currentConfig = Amplify.getConfig();

export default userAmplifyConfiguration;
