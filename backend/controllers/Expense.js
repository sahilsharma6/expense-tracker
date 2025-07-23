import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import AuditLog from "../models/AuditLog.js";
import Expense from "../models/Expense.js";

const addExpense = catchAsyncErrors(async (req, res) => {
  const { amount, category, date, notes } = req.body;

  if (!amount || !category || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const expense = await Expense.create({
    user: req.user._id,
    amount,
    category,
    date,
    notes,
  });

  await AuditLog.create({
    userId: req.user._id,
    expenseId: expense._id,
    action: "create",
  });

  res.status(201).json({
    success: true,
    expense,
  });
});

const getExpenses = catchAsyncErrors(async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    expenses,
  });
});

const getAllExpenses = catchAsyncErrors(async (req, res) => {
  const expenses = await Expense.find()
    .populate("user")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    expenses,
  });
});

const changeExpenseStatus = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const expense = await Expense.findById(id);
  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }
  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  expense.status = status;
  await expense.save();

  await AuditLog.create({
    userId: req.user._id,
    expenseId: expense._id,
    action: `status updated to ${status}`,
  });

  res.status(200).json({ message: "Expense status updated successfully" });
});

const getMonthlyExpenses = catchAsyncErrors(async (req, res) => {
  const expenses = await Expense.aggregate([
    {
      $match: {
        user: req.user._id,
        date: {
          $gte: new Date(new Date().setDate(1)), // Start of the month
          $lte: new Date(), // Up to today
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { _id: -1 },
    },
  ]);
  const formattedExpenses = expenses.map((expense) => ({
    month: expense._id,
    total: expense.totalAmount,
  }));
  res.status(200).json({
    success: true,
    expenses: formattedExpenses,
  });
});

// const getMonthlyExpenses = catchAsyncErrors(async (req, res) => {
//   const expenses = await Expense.aggregate([
//     {
//       $match: {
//         user: req.user._id,
//         date: {
//           $gte: new Date(new Date().setDate(1)), // Start of the month
//           $lte: new Date(), // Up to today
//         },
//       },
//     },
//     {
//       $group: {
//         _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
//         totalAmount: { $sum: "$amount" },
//       },
//     },
//     {
//       $sort: { _id: -1 },
//     },
//   ]);

//   res.status(200).json({
//     success: true,
//     expenses,
//   });
// });

export {
  addExpense,
  getExpenses,
  getAllExpenses,
  changeExpenseStatus,
  getMonthlyExpenses,
};
