const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      console.log("🔓 [AUTH] No token found - unauthorized request");
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(`✅ [AUTH] Token verified for user: ${decoded.id}`);
    next();
  } catch (error) {
    console.log("❌ [AUTH] Invalid or expired token");
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
