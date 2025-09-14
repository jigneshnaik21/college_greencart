import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  // Get token from Authorization header instead of cookies
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

  // Log for debugging
  console.log("Auth middleware - Authorization header:", authHeader);
  console.log("Auth middleware - Token:", token ? "Present" : "Missing");

  if (!token) {
    return res.json({ success: false, message: "Not Authorized" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      // Set userId on req object (not on body)
      req.userId = tokenDecode.id;
      console.log("Auth middleware - User ID:", tokenDecode.id);
    } else {
      return res.json({ success: false, message: "Not Authorized" });
    }
    next();
  } catch (error) {
    console.log("Auth middleware - JWT Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
