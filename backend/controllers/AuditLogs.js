import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import AuditLog from "../models/AuditLog.js";

const getAuditLogs = catchAsyncErrors(async (req, res) => {
  const logs = await AuditLog.find()
    .populate("userId", "email")
    .populate("expenseId")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    logs,
  });
});

export { getAuditLogs };
