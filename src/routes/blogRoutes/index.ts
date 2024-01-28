import { router } from "../../utils/constants";
import {
  createBlog,
  deleteABlog,
  dislikeABlog,
  getABlog,
  getAllBlogs,
  likeABlog,
  updateABlog,
  uploadBlogImages,
} from "../../services/blogServices";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAdmin } from "../../middleware/isAdmin";
import { resizeBlogImage, uploadPhoto } from "../../middleware/imageMiddleware";

router.post("/", authMiddleware, isAdmin, createBlog);
router.put(
  "/upload-blog-images/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 2),
  resizeBlogImage,
  uploadBlogImages
);
router.put("/like-blog", authMiddleware, likeABlog);
router.put("/dislike-blog", authMiddleware, dislikeABlog);
router.put("/:id", authMiddleware, isAdmin, updateABlog);
router.get("/", getAllBlogs);
router.get("/:id", getABlog);
router.delete("/:id", authMiddleware, isAdmin, deleteABlog);

export default router;
