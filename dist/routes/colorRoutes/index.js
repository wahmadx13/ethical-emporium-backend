"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const isAdmin_1 = require("../../middleware/isAdmin");
const colorServices_1 = require("../../services/colorServices");
constants_1.router.post("/", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, colorServices_1.createColor);
constants_1.router.put("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, colorServices_1.updateColor);
constants_1.router.get("/:id", colorServices_1.getAColor);
constants_1.router.get("/", colorServices_1.getAllColors);
constants_1.router.delete("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, colorServices_1.deleteAColor);
exports.default = constants_1.router;
//# sourceMappingURL=index.js.map