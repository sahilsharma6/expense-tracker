import express from "express";

import { getAuditLogs } from "../controllers/AuditLogs.js";

const router = express.Router();
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";

router
  .route("/auditLogs")
  .get(isAuthenticated, authorizeRoles("admin"), getAuditLogs);

export default router;
