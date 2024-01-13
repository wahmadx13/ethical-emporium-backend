import express from "express";
import {
  createUser,
  handleRefreshToken,
  loginUser,
  logoutUser,
  updateUser,
} from "../../services/userServices";
import { authMiddleware } from "../../middleware/authMiddleware";

//initialize router
const router = express.Router();

//user routes
router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/refresh", handleRefreshToken);
router.put("/update-user", authMiddleware, updateUser);

export default router;
