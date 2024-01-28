import { router } from "../../utils/constants";
import { authMiddleware } from "../../middleware/authMiddleware";
import {
  createAnEnquiry,
  deleteAnEnquiry,
  getAllEnquiries,
  getAnEnquiry,
  updateAnEnquiry,
} from "../../services/enquiryServices";
import { isAdmin } from "../../middleware/isAdmin";

router.post("/", createAnEnquiry);
router.put("/:id", authMiddleware, isAdmin, updateAnEnquiry);
router.get("/", getAllEnquiries);
router.get("/:id", getAnEnquiry);
router.delete("/:id", authMiddleware, isAdmin, deleteAnEnquiry);

export default router;
