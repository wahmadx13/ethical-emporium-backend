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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unblockAUser = exports.blockAUser = exports.resetUserPassword = exports.forgotUserPassword = exports.updateUserPassword = exports.deleteAUser = exports.getAUser = exports.getAllUsers = exports.updateUser = exports.logoutUserOfAllDevices = exports.logoutUser = exports.refreshUserToken = exports.loginUser = exports.verifyUser = exports.createUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const models_1 = require("../../models");
const helper_1 = require("../../utils/helper");
const authServices_1 = require("../../aws/cognito/authServices");
const auth_1 = require("aws-amplify/auth");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const refreshToken_1 = require("../../config/refreshToken");
const jwtToken_1 = require("../../config/jwtToken");
//Creating User
const createUser = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, phoneNumber, password } = request.body;
    const existingUser = yield models_1.UserModel.findOne({
        email,
    });
    try {
        if (existingUser) {
            response.json({ message: `User exists with current email: ${email}` });
        }
        else {
            yield (0, authServices_1.cognitoSignup)({
                username: email,
                name,
                password,
                email,
                phone_number: phoneNumber,
            });
            response.json({
                message: `A six digit code is sent to: ${email}. Please verify email address`,
            });
        }
    }
    catch (err) {
        throw new Error(`The following error occurred: ${err}`);
    }
}));
exports.createUser = createUser;
//Verifying User
const verifyUser = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code } = request.body;
    yield (0, authServices_1.cognitoVerifyUser)({
        username: email,
        confirmationCode: code,
    });
    response.json({ message: "User verified" });
}));
exports.verifyUser = verifyUser;
//Login user
const loginUser = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { email, password } = request.body;
    const findUser = yield models_1.UserModel.findOne({
        email,
    });
    if (!(findUser === null || findUser === void 0 ? void 0 : findUser.isBlocked)) {
        yield (0, authServices_1.cognitoSigninUser)({
            username: email,
            password,
        });
        const { accessToken, idToken } = (_a = (yield (0, auth_1.fetchAuthSession)()).tokens) !== null && _a !== void 0 ? _a : {};
        // console.log("accessToken: ", accessToken, "idToken: ", idToken);
        const refreshToken = (0, jwtToken_1.generateToken)((_b = accessToken === null || accessToken === void 0 ? void 0 : accessToken.payload) === null || _b === void 0 ? void 0 : _b.sub);
        response.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60,
        });
        response.json({
            message: "Signed in successfully",
            name: findUser === null || findUser === void 0 ? void 0 : findUser.name,
            email: findUser === null || findUser === void 0 ? void 0 : findUser.email,
            phoneNumber: findUser === null || findUser === void 0 ? void 0 : findUser.phoneNumber,
            refreshToken,
        });
    }
    else {
        throw new Error("Invalid Credentials or user blocked by admin");
    }
}));
exports.loginUser = loginUser;
const loginAdmin = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    const { email, password } = request.body;
    const findUser = yield models_1.UserModel.findOne({
        email,
    });
    if (((_c = findUser === null || findUser === void 0 ? void 0 : findUser.role) === null || _c === void 0 ? void 0 : _c.toLowerCase()) !== "admin") {
        throw new Error("Not Authorized");
    }
    yield (0, authServices_1.cognitoSigninUser)({
        username: email,
        password,
    });
    const { accessToken, idToken } = (_d = (yield (0, auth_1.fetchAuthSession)()).tokens) !== null && _d !== void 0 ? _d : {};
    // console.log("accessToken: ", accessToken, "idToken: ", idToken);
    const refreshToken = (0, jwtToken_1.generateToken)((_e = accessToken === null || accessToken === void 0 ? void 0 : accessToken.payload) === null || _e === void 0 ? void 0 : _e.sub);
    response.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60,
    });
    response.json({
        message: "Signed in successfully",
        name: findUser === null || findUser === void 0 ? void 0 : findUser.name,
        email: findUser === null || findUser === void 0 ? void 0 : findUser.email,
        phoneNumber: findUser === null || findUser === void 0 ? void 0 : findUser.phoneNumber,
        refreshToken,
    });
}));
//Refresh Token
const refreshUserToken = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const refreshToken = (_f = request.cookies) === null || _f === void 0 ? void 0 : _f.refreshToken;
    const { userId } = yield (0, authMiddleware_1.currentAuthenticatedUser)();
    const user = yield models_1.UserModel.findOne({ cognitoUserId: userId });
    request.user = user === null || user === void 0 ? void 0 : user.save();
    if (!refreshToken || !userId) {
        throw new Error("No refresh token in cookies or no authenticated user exists. Please signin again");
    }
    else {
        jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET, function (err, decoded) {
            if (err || userId !== (decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
                throw new Error("There is something wrong with refresh token");
            }
            else {
                const accessToken = (0, refreshToken_1.generateRefreshToken)(userId);
                response.json({ accessToken });
            }
        });
    }
}));
exports.refreshUserToken = refreshUserToken;
//Logout User
const logoutUser = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, authServices_1.cognitoSignout)();
    response.clearCookie("refreshToken", { httpOnly: true, secure: true });
    response.json({ message: "User signed out successfully" });
}));
exports.logoutUser = logoutUser;
//Signout of all devices
const logoutUserOfAllDevices = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, authServices_1.cognitoGlobalSignout)();
    response.json({ message: "User signed out of all devices successfully" });
}));
exports.logoutUserOfAllDevices = logoutUserOfAllDevices;
//Update User
const updateUser = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    const { _id } = request.user;
    (0, helper_1.validateMongoDBId)(_id);
    console.log("_id", _id);
    const updateUser = yield models_1.UserModel.findByIdAndUpdate(_id, {
        name: (_g = request === null || request === void 0 ? void 0 : request.body) === null || _g === void 0 ? void 0 : _g.name,
        address: (_h = request === null || request === void 0 ? void 0 : request.body) === null || _h === void 0 ? void 0 : _h.address,
    }, { new: true });
    if (updateUser) {
        response.json(updateUser);
    }
    else {
        response.status(404).json({
            message: "User not found",
        });
    }
}));
exports.updateUser = updateUser;
//Get All Users
const getAllUsers = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const getAllUsers = yield models_1.UserModel.find();
    response.json(getAllUsers);
}));
exports.getAllUsers = getAllUsers;
//Get A User
const getAUser = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const getAUser = yield models_1.UserModel.findById(id);
    response.json(getAUser);
}));
exports.getAUser = getAUser;
//Delete A User
const deleteAUser = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const deleteAUser = yield models_1.UserModel.findByIdAndDelete(id);
    yield (0, auth_1.deleteUser)();
    response.json(deleteAUser);
}));
exports.deleteAUser = deleteAUser;
//Update User Password
const updateUserPassword = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = request.body;
    yield (0, authServices_1.handleUpdatePassword)({
        oldPassword,
        newPassword,
    });
    response.json({ message: "Password updated successfully" });
}));
exports.updateUserPassword = updateUserPassword;
//Forgotten User Password
const forgotUserPassword = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = request.body;
    const user = yield models_1.UserModel.findOne({ email });
    if (!user) {
        throw new Error("The email is not associated with any user");
    }
    else {
        const code = (0, authServices_1.handlePasswordReset)(email);
        response.json(code);
    }
}));
exports.forgotUserPassword = forgotUserPassword;
//Reset User Password
const resetUserPassword = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code, password } = request.body;
    yield (0, authServices_1.handleConfirmResetPassword)({
        username: email,
        confirmationCode: code,
        newPassword: password,
    });
    response.json({ message: "Password updated successfully" });
}));
exports.resetUserPassword = resetUserPassword;
//Block User
const blockAUser = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const blockUser = yield models_1.UserModel.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
    response.json({ message: "User Blocked", blockUser });
}));
exports.blockAUser = blockAUser;
//Unblock A User
const unblockAUser = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    (0, helper_1.validateMongoDBId)(id);
    const unblockUser = yield models_1.UserModel.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
    response.json({ message: "User unblocked", unblockUser });
}));
exports.unblockAUser = unblockAUser;
