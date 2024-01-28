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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_1 = __importDefault(require("mongoose"));
const product_1 = require("../product");
const user_1 = require("../user");
var StatusOptions;
(function (StatusOptions) {
    StatusOptions["notProcessed"] = "Not Processed";
    StatusOptions["COD"] = "Cash On Delivery";
    StatusOptions["processing"] = "Processing";
    StatusOptions["dispatched"] = "Dispatched";
    StatusOptions["cancelled"] = "Cancelled";
    StatusOptions["delivered"] = "Delivered";
})(StatusOptions || (StatusOptions = {}));
var payIntent;
(function (payIntent) {
    payIntent["card"] = "card";
})(payIntent || (payIntent = {}));
class OrderedProducts {
}
__decorate([
    (0, typegoose_1.prop)({ ref: () => product_1.Product, type: mongoose_1.default.Schema.ObjectId }),
    __metadata("design:type", Object)
], OrderedProducts.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], OrderedProducts.prototype, "count", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], OrderedProducts.prototype, "color", void 0);
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, typegoose_1.prop)({ type: () => [OrderedProducts] }),
    __metadata("design:type", Array)
], Order.prototype, "orderedProducts", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, enum: payIntent, default: payIntent.card }),
    __metadata("design:type", String)
], Order.prototype, "paymentOption", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Object)
], Order.prototype, "paymentIntent", void 0);
__decorate([
    (0, typegoose_1.prop)({ enum: StatusOptions, default: StatusOptions.notProcessed }),
    __metadata("design:type", String)
], Order.prototype, "orderStatus", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => user_1.User, type: () => mongoose_1.default.Schema.ObjectId }),
    __metadata("design:type", Object)
], Order.prototype, "orderBy", void 0);
exports.Order = Order = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true,
        },
        options: {
            allowMixed: typegoose_1.Severity.ALLOW,
        },
    })
], Order);
//# sourceMappingURL=index.js.map