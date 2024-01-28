import { router } from "../../utils/constants";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAdmin } from "../../middleware/isAdmin";
import {
  createBrand,
  deleteABrand,
  getABrand,
  getAllBBrands,
  updateBrand,
} from "../../services/brandServices";

router.post("/", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.get("/:id", getABrand);
router.get("/", getAllBBrands);
router.delete("/:id", authMiddleware, isAdmin, deleteABrand);

export default router;
