"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enquiry = void 0;
const typegoose_1 = require("@typegoose/typegoose");
var StatusOptions;
(function (StatusOptions) {
    StatusOptions["submitted"] = "Submitted";
    StatusOptions["contacted"] = "Contacted";
    StatusOptions["inprogress"] = "In Progress";
    StatusOptions["resolved"] = "Resolved";
})(StatusOptions || (StatusOptions = {}));
let Enquiry = class Enquiry {
};
exports.Enquiry = Enquiry;
__decorate([
    (0, typegoose_1.prop)({ required: true })
], Enquiry.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true })
], Enquiry.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true })
], Enquiry.prototype, "mobile", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true })
], Enquiry.prototype, "comment", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: StatusOptions.submitted })
], Enquiry.prototype, "status", void 0);
exports.Enquiry = Enquiry = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true,
        },
    })
], Enquiry);
