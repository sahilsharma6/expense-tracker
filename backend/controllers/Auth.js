import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/User.js";

// Register a new user
export const register = catchAsyncErrors(async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      username,
      email,
      password,
      role: role || "employee",
    });

    const token = user.getJWTToken();

    res.status(201).json({
      message: "User registered",
      token,
      user: { username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login user
export const login = catchAsyncErrors(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = user.getJWTToken();

    res.json({
      message: "User logged in",
      token,
      user: { username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
