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
exports.sendEmail = exports.validateMongoDBId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const validateMongoDBId = (id) => {
    const isValid = mongoose_1.default.Types.ObjectId.isValid(id);
    if (!isValid) {
        throw new Error("This id is not valid or not found");
    }
};
exports.validateMongoDBId = validateMongoDBId;
const sendEmail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        debug: true,
        logger: true,
        secure: false,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASSWORD,
        },
    });
    // async..await is not allowed in global scope, must use a wrapper
    let info = yield transporter.sendMail({
        from: '"Hey👻"noreply@ethical-emporium.com', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
    });
    console.log("info", info);
});
exports.sendEmail = sendEmail;
//# sourceMappingURL=helper.js.map