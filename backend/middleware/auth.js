import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../config/config.js";

// Middleware to verify JWT and attach user to req
export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Optional: Middleware for role-based access
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Role (${req.user.role}) not allowed` });
    }
    next();
  };
};
