import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/User.js";

const getAllUsers = catchAsyncErrors(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    users,
  });
});

export { getAllUsers };
