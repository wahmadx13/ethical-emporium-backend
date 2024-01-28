"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const isAdmin_1 = require("../../middleware/isAdmin");
const coupon_1 = require("../../services/coupon");
constants_1.router.post("/", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, coupon_1.createACoupon);
constants_1.router.put("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, coupon_1.updateACoupon);
constants_1.router.get("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, coupon_1.getACoupon);
constants_1.router.get("/", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, coupon_1.getAllCoupons);
constants_1.router.delete("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, coupon_1.deleteACoupon);
exports.default = constants_1.router;
//# sourceMappingURL=index.js.map