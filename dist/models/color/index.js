"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = void 0;
const typegoose_1 = require("@typegoose/typegoose");
var ColorOptions;
(function (ColorOptions) {
    ColorOptions["red"] = "red";
    ColorOptions["white"] = "white";
    ColorOptions["violet"] = "violet";
    ColorOptions["black"] = "black";
    ColorOptions["silver"] = "silver";
    ColorOptions["pink"] = "pink";
    ColorOptions["purple"] = "purple";
    ColorOptions["orange"] = "orange";
    ColorOptions["indigo"] = "indigo";
    ColorOptions["blue"] = "blue";
})(ColorOptions || (ColorOptions = {}));
let Color = class Color {
};
exports.Color = Color;
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true, index: true, enum: ColorOptions }),
    __metadata("design:type", String)
], Color.prototype, "title", void 0);
exports.Color = Color = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true,
        },
    })
], Color);
//# sourceMappingURL=index.js.map