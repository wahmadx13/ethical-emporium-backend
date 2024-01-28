"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const isAdmin_1 = require("../../middleware/isAdmin");
const productCategoryServices_1 = require("../../services/productCategoryServices");
constants_1.router.post("/", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, productCategoryServices_1.createProductCategory);
constants_1.router.put("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, productCategoryServices_1.updateProductCategory);
constants_1.router.get("/:id", productCategoryServices_1.getAProductCategory);
constants_1.router.get("/", productCategoryServices_1.getAllProductCategories);
constants_1.router.delete("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, productCategoryServices_1.deleteAProductCategory);
exports.default = constants_1.router;
//# sourceMappingURL=index.js.map