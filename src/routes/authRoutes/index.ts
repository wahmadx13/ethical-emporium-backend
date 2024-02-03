import { router } from "../../utils/constants";
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
  loginAdmin,
  currentAuthenticatedUser,
} from "../../services/authServices";
import { isAdmin } from "../../middleware/isAdmin";
import { authMiddleware } from "../../middleware/authMiddleware";

//user routes
router.post("/register", createUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/login-admin", loginAdmin);
router.post("/forgot-password", forgotUserPassword);
router.get("/logout", logoutUser);
router.get("/logout-globally", logoutUserOfAllDevices);
router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.get("/users/:id", getAUser);
router.get("/current-user", currentAuthenticatedUser);
router.put("/update-user", authMiddleware, updateUser);
router.put("/update-password", updateUserPassword);
router.put("/reset-password", resetUserPassword);
router.put("/block-user/:id", authMiddleware, isAdmin, blockAUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockAUser);
router.delete("/delete/:id", authMiddleware, deleteAUser);

export default router;
