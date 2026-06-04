const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "formez_jwt_secret_token_123");
      req.user = await Admin.findById(decoded.id).select("-password");
      
      if (!req.user) {
        return res.status(401).json({ message: "Admin profile no longer exists" });
      }
      
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, session expired" });
    }
  }
  
  return res.status(401).json({ message: "Not authorized, token missing" });
};

module.exports = { protect };
