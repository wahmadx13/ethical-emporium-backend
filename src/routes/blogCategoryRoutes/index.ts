import { router } from "../../utils/constants";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAdmin } from "../../middleware/isAdmin";
import {
  createBlogCategory,
  deleteABlogCategory,
  getABlogCategory,
  getAllBlogsCategory,
  updateBlogCategory,
} from "../../services/blogCategoryServices";

router.post("/", authMiddleware, isAdmin, createBlogCategory);
router.put("/:id", authMiddleware, isAdmin, updateBlogCategory);
router.get("/:id", getABlogCategory);
router.get("/", getAllBlogsCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteABlogCategory);

export default router;
