import { router } from "../../utils/constants";
import { authMiddleware } from "../../middleware/authMiddleware";
import {
  addToUserCart,
  createOrder,
  deleteOrder,
  emptyUserCart,
  getAllOrders,
  getAllOrdersByAUser,
  getAllOrdersForUser,
  removeAnItemFromCart,
  updateOrderStatus,
} from "../../services/userServices";
import { isAdmin } from "../../middleware/isAdmin";

//User Cart Routes
router.post("/cart", authMiddleware, addToUserCart);
router.put("/cart/remove-item", authMiddleware, removeAnItemFromCart);
router.put("/cart/empty-cart", authMiddleware, emptyUserCart);

//User Order Routes
router.post("/order/create-order", authMiddleware, createOrder);
router.get("/order/user-orders/:id", authMiddleware, getAllOrdersForUser);
router.get(
  "/order/order-by-user/:id",
  authMiddleware,
  isAdmin,
  getAllOrdersByAUser
);
router.get("/order/all-orders", authMiddleware, isAdmin, getAllOrders);
router.put(
  "/order/update-order-status/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);
router.delete("/order/delete/:id", authMiddleware, isAdmin, deleteOrder);

export default router;
