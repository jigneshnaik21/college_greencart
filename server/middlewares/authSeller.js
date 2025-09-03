import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  // Read token from Authorization header
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    // Validate seller by email from token payload
    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      req.sellerEmail = tokenDecode.email;
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default authSeller;
