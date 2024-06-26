import { router } from "../../utils/constants";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAdmin } from "../../middleware/isAdmin";
import {
  createProductCategory,
  deleteAProductCategory,
  getAProductCategory,
  getAllProductCategories,
  updateProductCategory,
} from "../../services/productCategoryServices";

router.post("/", authMiddleware, isAdmin, createProductCategory);
router.put("/:id", authMiddleware, isAdmin, updateProductCategory);
router.get("/:id", getAProductCategory);
router.get("/", getAllProductCategories);
router.delete("/:id", authMiddleware, isAdmin, deleteAProductCategory);

export default router;
