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
exports.resizeBlogImage = exports.resizeProductImage = exports.uploadPhoto = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const path = require("path");
const fs = require("fs");
const multerStorage = multer_1.default.diskStorage({
    destination: function (request, file, cb) {
        cb(null, path.join(__dirname, "../../public/images"));
    },
    filename: function (request, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    },
});
const multerFilter = (request, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb({
            message: "Unsupported file format",
        }, false);
    }
};
const uploadPhoto = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldNameSize: 2000000 },
});
exports.uploadPhoto = uploadPhoto;
const resizeProductImage = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!request.files)
        return next();
    const files = request.files;
    yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, sharp_1.default)(file.path)
            .resize(300, 300)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public/images/products/${file.filename}`);
        fs.unlinkSync(`public/images/products/${file.filename}`);
    })));
    next();
});
exports.resizeProductImage = resizeProductImage;
const resizeBlogImage = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!request.files)
        return next();
    const files = request.files;
    yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, sharp_1.default)(file.path)
            .resize(300, 300)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public/images/blogs/${file.filename}`);
        fs.unlinkSync(`public/images/blogs/${file.filename}`);
    })));
    next();
});
exports.resizeBlogImage = resizeBlogImage;
//# sourceMappingURL=imageMiddleware.js.map