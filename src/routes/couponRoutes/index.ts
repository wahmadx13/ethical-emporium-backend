import { router } from "../../utils/constants";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAdmin } from "../../middleware/isAdmin";
import {
  createACoupon,
  deleteACoupon,
  getACoupon,
  getAllCoupons,
  updateACoupon,
} from "../../services/coupon";

router.post("/", authMiddleware, isAdmin, createACoupon);
router.put("/:id", authMiddleware, isAdmin, updateACoupon);
router.get("/:id", authMiddleware, isAdmin, getACoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupons);
router.delete("/:id", authMiddleware, isAdmin, deleteACoupon);

export default router;
