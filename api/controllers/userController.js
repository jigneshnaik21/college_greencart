import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User : /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return token in response body instead of cookie for Authorization header auth
    return res.json({
      success: true,
      user: { email: user.email, name: user.name, _id: user._id },
      token: token,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Login User : /api/user/login

export const login = async (req, res) => {
  try {
    console.log("🔍 LOGIN DEBUG: Login request received");
    console.log("🔍 LOGIN DEBUG: Request body:", { email: req.body.email, password: req.body.password ? "***" : "missing" });
    console.log("🔍 LOGIN DEBUG: User agent:", req.headers["user-agent"]);
    console.log("🔍 LOGIN DEBUG: Origin:", req.headers.origin);
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("🔍 LOGIN DEBUG: Missing email or password");
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }
    
    console.log("🔍 LOGIN DEBUG: Looking up user with email:", email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log("🔍 LOGIN DEBUG: User not found for email:", email);
      return res.json({ success: false, message: "Invalid email or password" });
    }

    console.log("🔍 LOGIN DEBUG: User found, checking password");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("🔍 LOGIN DEBUG: Password mismatch for user:", email);
      return res.json({ success: false, message: "Invalid email or password" });
    }

    console.log("🔍 LOGIN DEBUG: Password match, generating token");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("🔍 LOGIN DEBUG: Login successful for user:", email);
    // Return token in response body instead of cookie for Authorization header auth
    return res.json({
      success: true,
      user: { email: user.email, name: user.name, _id: user._id },
      token: token,
    });
  } catch (error) {
    console.error("🔍 LOGIN DEBUG: Login error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Check Auth : /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.json({ success: false, message: "Not Authorized" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Logout User : /api/user/logout

export const logout = async (req, res) => {
  try {
    // Token is stored in localStorage, so just return success
    // Frontend will handle clearing the token
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
