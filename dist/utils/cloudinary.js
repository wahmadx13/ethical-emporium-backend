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
exports.deleteImages = exports.imageUpload = void 0;
const cloudinaryConfig_1 = require("../config/cloudinaryConfig");
const imageUpload = (file) => {
    return new Promise((resolve) => {
        cloudinaryConfig_1.cloudinary.uploader.upload(file, { resource_type: "auto" }, (error, result) => {
            if (error) {
                console.error("Error uploading to Cloudinary:", error);
                resolve(null);
            }
            else {
                resolve({
                    url: result === null || result === void 0 ? void 0 : result.secure_url,
                    asset_id: result === null || result === void 0 ? void 0 : result.asset_id,
                    public_id: result === null || result === void 0 ? void 0 : result.public_id,
                });
            }
        });
    });
};
exports.imageUpload = imageUpload;
const deleteImages = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve) => {
        cloudinaryConfig_1.cloudinary.uploader.destroy(file, (result) => {
            resolve({
                url: result === null || result === void 0 ? void 0 : result.secure_url,
                asset_id: result === null || result === void 0 ? void 0 : result.asset_id,
                public_id: result === null || result === void 0 ? void 0 : result.public_id,
            }, {
                resource_type: "auto",
            });
        });
    });
});
exports.deleteImages = deleteImages;
