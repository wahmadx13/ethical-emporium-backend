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
exports.deleteAnEnquiry = exports.getAllEnquiries = exports.getAnEnquiry = exports.updateAnEnquiry = exports.createAnEnquiry = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const models_1 = require("../../models");
//Create An Enquiry
const createAnEnquiry = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const createEnquiry = yield models_1.EnquiryModel.create(request.body);
    response.json(createEnquiry);
}));
exports.createAnEnquiry = createAnEnquiry;
//Update An Enquiry
const updateAnEnquiry = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const updateEnquiry = yield models_1.EnquiryModel.findByIdAndUpdate(id, request.body, { new: true });
    response.json(updateEnquiry);
}));
exports.updateAnEnquiry = updateAnEnquiry;
//Get an Enquiry
const getAnEnquiry = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const getEnquiry = yield models_1.EnquiryModel.findById(id);
    response.json(getEnquiry);
}));
exports.getAnEnquiry = getAnEnquiry;
//Get All Enquiries
const getAllEnquiries = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const getEnquiries = yield models_1.EnquiryModel.find();
    response.json(getEnquiries);
}));
exports.getAllEnquiries = getAllEnquiries;
//Delete An Enquiry
const deleteAnEnquiry = (0, express_async_handler_1.default)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const deleteEnquiry = yield models_1.EnquiryModel.findByIdAndDelete(id);
    response.json(deleteEnquiry);
}));
exports.deleteAnEnquiry = deleteAnEnquiry;
//# sourceMappingURL=index.js.map