"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
const authServices_1 = require("../../services/authServices");
const isAdmin_1 = require("../../middleware/isAdmin");
const authMiddleware_1 = require("../../middleware/authMiddleware");
//user routes
constants_1.router.post("/register", authServices_1.createUser);
constants_1.router.post("/verify", authServices_1.verifyUser);
constants_1.router.post("/login", authServices_1.loginUser);
constants_1.router.post("/forgot-password", authServices_1.forgotUserPassword);
constants_1.router.get("/logout", authServices_1.logoutUser);
constants_1.router.get("/logout-globally", authServices_1.logoutUserOfAllDevices);
constants_1.router.get("/users", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, authServices_1.getAllUsers);
constants_1.router.get("/users/:id", authServices_1.getAUser);
constants_1.router.get("/refresh", authServices_1.refreshUserToken);
constants_1.router.put("/update-user", authMiddleware_1.authMiddleware, authServices_1.updateUser);
constants_1.router.put("/update-password", authServices_1.updateUserPassword);
constants_1.router.put("/reset-password", authServices_1.resetUserPassword);
constants_1.router.put("/block-user/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, authServices_1.blockAUser);
constants_1.router.put("/unblock-user/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, authServices_1.unblockAUser);
constants_1.router.delete("/delete/:id", authMiddleware_1.authMiddleware, authServices_1.deleteAUser);
exports.default = constants_1.router;
//# sourceMappingURL=index.js.map