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
} from "../../services/userServices";
import { isAdmin } from "../../middleware/isAdmin";

//initialize router
const router = express.Router();

//user routes
router.post("/register", createUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotUserPassword);
router.get("/logout", logoutUser);
router.get("/logout-globally", logoutUserOfAllDevices);
router.get("/users", getAllUsers);
router.get("/users/:id", getAUser);
router.put("/update-user", updateUser);
router.put("/update-password", updateUserPassword);
router.put("/reset-password", resetUserPassword);
router.put("/block-user/:id", isAdmin, blockAUser);
router.put("/unblock-user/:id", isAdmin, unblockAUser);
router.delete("/delete/:id", deleteAUser);

export default router;
