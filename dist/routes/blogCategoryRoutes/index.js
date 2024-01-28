"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const isAdmin_1 = require("../../middleware/isAdmin");
const blogCategoryServices_1 = require("../../services/blogCategoryServices");
constants_1.router.post("/", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, blogCategoryServices_1.createBlogCategory);
constants_1.router.put("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, blogCategoryServices_1.updateBlogCategory);
constants_1.router.get("/:id", blogCategoryServices_1.getABlogCategory);
constants_1.router.get("/", blogCategoryServices_1.getAllBlogsCategory);
constants_1.router.delete("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, blogCategoryServices_1.deleteABlogCategory);
exports.default = constants_1.router;
//# sourceMappingURL=index.js.map