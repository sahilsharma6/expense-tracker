import express from "express";

import { getAllUsers } from "../controllers/User.js";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/all").get(isAuthenticated, authorizeRoles("admin"), getAllUsers);
export default router;
