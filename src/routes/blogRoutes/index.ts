import express from "express";
import {
  createBlog,
  deleteABlog,
  getABlog,
  getAllBlogs,
  updateABlog,
} from "../../services/blogServices";

const router = express.Router();

router.post("/", createBlog);
router.put("/:id", updateABlog);
router.get("/", getAllBlogs);
router.get("/:id", getABlog);
router.delete("/:id", deleteABlog);

export default router;
