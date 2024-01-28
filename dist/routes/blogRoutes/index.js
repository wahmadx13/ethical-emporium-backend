"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
const blogServices_1 = require("../../services/blogServices");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const isAdmin_1 = require("../../middleware/isAdmin");
const imageMiddleware_1 = require("../../middleware/imageMiddleware");
constants_1.router.post("/", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, blogServices_1.createBlog);
constants_1.router.put("/upload-blog-images/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, imageMiddleware_1.uploadPhoto.array("images", 2), imageMiddleware_1.resizeBlogImage, blogServices_1.uploadBlogImages);
constants_1.router.put("/like-blog", authMiddleware_1.authMiddleware, blogServices_1.likeABlog);
constants_1.router.put("/dislike-blog", authMiddleware_1.authMiddleware, blogServices_1.dislikeABlog);
constants_1.router.put("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, blogServices_1.updateABlog);
constants_1.router.get("/", blogServices_1.getAllBlogs);
constants_1.router.get("/:id", blogServices_1.getABlog);
constants_1.router.delete("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, blogServices_1.deleteABlog);
exports.default = constants_1.router;
//# sourceMappingURL=index.js.map