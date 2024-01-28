import { router } from "../../utils/constants";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAdmin } from "../../middleware/isAdmin";
import {
  createColor,
  deleteAColor,
  getAColor,
  getAllColors,
  updateColor,
} from "../../services/colorServices";

router.post("/", authMiddleware, isAdmin, createColor);
router.put("/:id", authMiddleware, isAdmin, updateColor);
router.get("/:id", getAColor);
router.get("/", getAllColors);
router.delete("/:id", authMiddleware, isAdmin, deleteAColor);

export default router;
