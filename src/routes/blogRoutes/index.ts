import express from "express";
import {
  createBlog,
  getABlog,
  getAllBlogs,
  updateABlog,
} from "../../services/blogServices";

const router = express.Router();

router.post("/", createBlog);
router.put("/:id", updateABlog);
router.get("/", getAllBlogs);
router.get("/:id", getABlog);

export default router;
