"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdatePassword = exports.handleConfirmResetPassword = exports.handleResetPasswordNextStep = exports.handlePasswordReset = exports.cognitoGlobalSignout = exports.cognitoSignout = exports.cognitoSigninUser = exports.cognitoVerifyUser = exports.cognitoSignup = void 0;
const auth_1 = require("aws-amplify/auth");
//Sign Up
const cognitoSignup = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email, phone_number, name } = data;
    try {
        const { isSignUpComplete, userId, nextStep } = yield (0, auth_1.signUp)({
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
        return { isSignUpComplete, userId, nextStep };
    }
    catch (err) {
        throw new Error(`Error while signing up: ${err}`);
    }
});
exports.cognitoSignup = cognitoSignup;
//Verify User
const cognitoVerifyUser = ({ username, confirmationCode, }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("username", username);
    console.log("confirmationCode", confirmationCode);
    try {
        const { isSignUpComplete, nextStep } = yield (0, auth_1.confirmSignUp)({
            username,
            confirmationCode,
        });
        return { isSignUpComplete, nextStep };
    }
    catch (err) {
        throw new Error(`An error occurred during confirmation: ${err}`);
    }
});
exports.cognitoVerifyUser = cognitoVerifyUser;
//Signin User
const cognitoSigninUser = ({ username, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isSignedIn, nextStep } = yield (0, auth_1.signIn)({ username, password });
        return { isSignedIn, nextStep };
    }
    catch (err) {
        throw new Error(`An error occurred during signin process: ${err}`);
    }
});
exports.cognitoSigninUser = cognitoSigninUser;
//Signout User
const cognitoSignout = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, auth_1.signOut)();
        console.log("Signed out of all devices");
    }
    catch (err) {
        throw new Error(`The following error occurred during the process`);
    }
});
exports.cognitoSignout = cognitoSignout;
//Signout of all devices
const cognitoGlobalSignout = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, auth_1.signOut)({ global: true });
    }
    catch (err) {
        throw new Error(`An error occurred during the process: ${err}`);
    }
});
exports.cognitoGlobalSignout = cognitoGlobalSignout;
//Reset Password
const handlePasswordReset = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const output = yield (0, auth_1.resetPassword)({ username });
        (0, exports.handleResetPasswordNextStep)(output);
    }
    catch (err) {
        throw new Error(`An error occurred during the process: ${err}`);
    }
});
exports.handlePasswordReset = handlePasswordReset;
const handleResetPasswordNextStep = (output) => __awaiter(void 0, void 0, void 0, function* () {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
        case "CONFIRM_RESET_PASSWORD_WITH_CODE":
            const codeDeliveryDetails = nextStep.codeDeliveryDetails;
            console.log(`Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`);
            break;
        case "DONE":
            console.log("Password reset successfully");
            break;
    }
});
exports.handleResetPasswordNextStep = handleResetPasswordNextStep;
//Confirm Reset Password Code
const handleConfirmResetPassword = ({ username, confirmationCode, newPassword, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, auth_1.confirmResetPassword)({ username, confirmationCode, newPassword });
    }
    catch (err) {
        throw new Error(`Error during reset password: ${err}`);
    }
});
exports.handleConfirmResetPassword = handleConfirmResetPassword;
//Update Password
const handleUpdatePassword = ({ oldPassword, newPassword, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, auth_1.updatePassword)({ oldPassword, newPassword });
    }
    catch (err) {
        throw new Error(`Error occurred: ${err}`);
    }
});
exports.handleUpdatePassword = handleUpdatePassword;
