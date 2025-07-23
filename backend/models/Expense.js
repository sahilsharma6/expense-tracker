import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    receipt: {
      type: String,
      default: null, // URL or path to the receipt image
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", ExpenseSchema);
export default Expense;
