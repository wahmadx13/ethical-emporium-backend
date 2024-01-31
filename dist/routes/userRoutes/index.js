"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const userServices_1 = require("../../services/userServices");
const isAdmin_1 = require("../../middleware/isAdmin");
//User Cart Routes
constants_1.router.post("/cart", authMiddleware_1.authMiddleware, userServices_1.addToUserCart);
constants_1.router.put("/cart/remove-item", authMiddleware_1.authMiddleware, userServices_1.removeAnItemFromCart);
constants_1.router.put("/cart/empty-cart", authMiddleware_1.authMiddleware, userServices_1.emptyUserCart);
//User Order Routes
constants_1.router.post("/order/create-order", authMiddleware_1.authMiddleware, userServices_1.createOrder);
constants_1.router.get("/order/user-orders/:id", authMiddleware_1.authMiddleware, userServices_1.getAllOrdersForUser);
constants_1.router.get("/order/order-by-user/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, userServices_1.getAllOrdersByAUser);
constants_1.router.get("/order/all-orders", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, userServices_1.getAllOrders);
constants_1.router.put("/order/update-order-status/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, userServices_1.updateOrderStatus);
constants_1.router.delete("/order/delete/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, userServices_1.deleteOrder);
exports.default = constants_1.router;
