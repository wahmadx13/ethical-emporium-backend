"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
const productServices_1 = require("../../services/productServices");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const isAdmin_1 = require("../../middleware/isAdmin");
const imageMiddleware_1 = require("../../middleware/imageMiddleware");
constants_1.router.post("/", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, productServices_1.createProduct);
constants_1.router.put("/upload-product-images/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, imageMiddleware_1.uploadPhoto.array("images", 10), imageMiddleware_1.resizeProductImage, productServices_1.uploadProductImages);
constants_1.router.put("/wishlist", authMiddleware_1.authMiddleware, productServices_1.addToWishlist);
constants_1.router.put("/rating", authMiddleware_1.authMiddleware, productServices_1.rating);
constants_1.router.get("/", productServices_1.getAllProducts);
constants_1.router.put("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, productServices_1.updateAProduct);
constants_1.router.get("/:id", productServices_1.getAProduct);
constants_1.router.delete("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, productServices_1.deleteAProduct);
constants_1.router.delete("/delete-product-images/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, productServices_1.deleteProductImages);
exports.default = constants_1.router;
//# sourceMappingURL=index.js.map