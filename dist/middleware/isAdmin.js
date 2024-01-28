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
exports.isAdmin = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const models_1 = require("../models");
exports.isAdmin = (0, express_async_handler_1.default)((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email } = request.user;
    const admin = yield models_1.UserModel.findOne({ email });
    if (((_a = admin === null || admin === void 0 ? void 0 : admin.role) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== "admin") {
        throw new Error("You are not an Admin");
    }
    else {
        next();
    }
}));
//# sourceMappingURL=isAdmin.js.map