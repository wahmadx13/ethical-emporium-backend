import express from "express";
import {
  createUser,
  verifyUser,
  deleteAUser,
  getAUser,
  getAllUsers,
  loginUser,
  logoutUser,
  updateUserPassword,
  updateUser,
  resetUserPassword,
  blockAUser,
  unblockAUser,
  logoutUserOfAllDevices,
  forgotUserPassword,
  refreshUserToken,
} from "../../services/userServices";
import { isAdmin } from "../../middleware/isAdmin";
import { authMiddleware } from "../../middleware/authMiddleware";

//initialize router
const router = express.Router();

//user routes
router.post("/register", createUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotUserPassword);
router.get("/logout", logoutUser);
router.get("/logout-globally", logoutUserOfAllDevices);
router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.get("/users/:id", getAUser);
router.get("/refresh", refreshUserToken);
router.put("/update-user", authMiddleware, updateUser);
router.put("/update-password", updateUserPassword);
router.put("/reset-password", resetUserPassword);
router.put("/block-user/:id", authMiddleware, isAdmin, blockAUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockAUser);
router.delete("/delete/:id", authMiddleware, deleteAUser);

export default router;
