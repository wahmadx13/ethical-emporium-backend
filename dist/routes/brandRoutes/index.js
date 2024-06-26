"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const isAdmin_1 = require("../../middleware/isAdmin");
const brandServices_1 = require("../../services/brandServices");
constants_1.router.post("/", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, brandServices_1.createBrand);
constants_1.router.put("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, brandServices_1.updateBrand);
constants_1.router.get("/:id", brandServices_1.getABrand);
constants_1.router.get("/", brandServices_1.getAllBBrands);
constants_1.router.delete("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, brandServices_1.deleteABrand);
exports.default = constants_1.router;
