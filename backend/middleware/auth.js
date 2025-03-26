const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware to authenticate user
const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization"); // Get token from headers

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const tokenWithoutBearer = token.split(" ")[1]; // Extract the actual token
    const decoded = jwt.verify(tokenWithoutBearer, process.env.SECRET);

    req.user = await User.findById(decoded.id).select("-password"); // Get user

    if (!req.user) {
      return res.status(401).json({ msg: "User not found" });
    }

    console.log("Authenticated User:", req.user); // Debugging
    next();
  } catch (error) {
    console.error("JWT Authentication Error:", error);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
   
    if (!req.user || req.user.role !== "admin") {
     
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }
    next();
  };

module.exports = { authenticate, isAdmin };