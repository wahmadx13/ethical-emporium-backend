import express from "express";
import {
  createUser,
  verifyUser,
  loginUser,
  logoutUser,
  updateUserPassword,
  resetUserPassword,
  logoutUserOfAllDevices,
  forgotUserPassword,
  currentAuthenticatedUser,
  refreshUserToken,
} from "../../services/authServices";

const router = express.Router();

//user routes
router.post("/register", createUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotUserPassword);
router.get("/logout", logoutUser);
router.get("/logout-globally", logoutUserOfAllDevices);
router.get("/current-user", currentAuthenticatedUser);
router.get("/refresh-token", refreshUserToken);
router.put("/update-password", updateUserPassword);
router.put("/reset-password", resetUserPassword);

export default router;
