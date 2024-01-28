"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const enquiryServices_1 = require("../../services/enquiryServices");
const isAdmin_1 = require("../../middleware/isAdmin");
constants_1.router.post("/", enquiryServices_1.createAnEnquiry);
constants_1.router.put("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, enquiryServices_1.updateAnEnquiry);
constants_1.router.get("/", enquiryServices_1.getAllEnquiries);
constants_1.router.get("/:id", enquiryServices_1.getAnEnquiry);
constants_1.router.delete("/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, enquiryServices_1.deleteAnEnquiry);
exports.default = constants_1.router;
//# sourceMappingURL=index.js.map