import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  expenseId: { type: mongoose.Schema.Types.ObjectId, ref: "Expense" },
  action: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const AuditLog = mongoose.model("AuditLog", AuditLogSchema);

export default AuditLog;
