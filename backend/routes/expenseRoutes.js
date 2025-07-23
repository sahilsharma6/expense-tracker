import express from "express";

import {
  getExpenses,
  addExpense,
  changeExpenseStatus,
  getAllExpenses,
  getMonthlyExpenses,
} from "../controllers/Expense.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/expenses").post(isAuthenticated, addExpense);
router.route("/expenses").get(isAuthenticated, getExpenses);

router.route("/expenses/:id/status").put(isAuthenticated, changeExpenseStatus);

router.route("/expenses/all").get(isAuthenticated, getAllExpenses);

router.route("/expenses/monthly").get(isAuthenticated, getMonthlyExpenses);

export default router;
