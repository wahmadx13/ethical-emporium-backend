import express from "express";
import {
  createUser,
  verifyUser,
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
  blockAUser,
  unblockAUser,
} from "../../services/userServices";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAdmin } from "../../middleware/isAdmin";

//initialize router
const router = express.Router();

//user routes
router.post("/register", createUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotUserPasswordToken);
router.get("/logout", logoutUser);
router.get("/refresh", handleRefreshToken);
router.get("/users", getAllUsers);
router.get("/users/:id", getAUser);
router.put("/update-user", updateUser);
router.put("/update-password", authMiddleware, updateUserPassword);
router.put("/forgot-password/:token", resetUserPassword);
router.put("/forgot-password/:token", resetUserPassword);
router.put("/block-user/:id", authMiddleware, isAdmin, blockAUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockAUser);
router.delete("/delete/:id", authMiddleware, deleteAUser);

export default router;
