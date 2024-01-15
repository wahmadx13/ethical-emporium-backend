import express from "express";
import {
  createUser,
  deleteAUser,
  forgotUserPasswordToken,
  getAUser,
  getAllUsers,
  handleRefreshToken,
  loginUser,
  logoutUser,
  updateUserPassword,
  updateUser,
  resetUserPassword,
} from "../../services/userServices";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAdmin } from "../../middleware/isAdmin";

//initialize router
const router = express.Router();

//user routes
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotUserPasswordToken);
router.put("/forgot-password/:token", resetUserPassword);
router.get("/logout", logoutUser);
router.get("/refresh", handleRefreshToken);
router.get("/users", getAllUsers);
router.get("/users/:id", getAUser);
router.put("/update-user", authMiddleware, updateUser);
router.put("/update-password", authMiddleware, updateUserPassword);
router.delete("/delete/:id", authMiddleware, deleteAUser);

export default router;
