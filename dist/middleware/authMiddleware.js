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
exports.authMiddleware = exports.currentAuthenticatedUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("aws-amplify/auth");
const models_1 = require("../models");
const currentAuthenticatedUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, signInDetails } = yield (0, auth_1.getCurrentUser)();
        return { userId, signInDetails };
    }
    catch (err) {
        throw new Error(`No authenticated user exist: ${err}`);
    }
});
exports.currentAuthenticatedUser = currentAuthenticatedUser;
const authMiddleware = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let token;
    if ((_a = request === null || request === void 0 ? void 0 : request.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith("Bearer")) {
        token = request.headers.authorization.split(" ")[1];
        if (token) {
            const decoded = (yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET));
            const user = yield models_1.UserModel.findOne({
                cognitoUserId: decoded === null || decoded === void 0 ? void 0 : decoded.id,
            });
            request.user = yield (user === null || user === void 0 ? void 0 : user.save());
            next();
        }
    }
    else {
        throw new Error("There is no token attached to header");
    }
});
exports.authMiddleware = authMiddleware;
