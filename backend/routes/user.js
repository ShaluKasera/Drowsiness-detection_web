const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  forgotPassword,
  handleResetPassword,
  getUnapprovedUsers,
  rejectUser,
  approveUser,
  getUserDetails,
} = require("../controllers/user");

const { authenticate,isAdmin } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/signin", login);
router.post("/forgotpassword", forgotPassword);
router.post("/reset-password/:resetToken", handleResetPassword);
router.get("/users/:id",authenticate,getUserDetails)

// Admin-only routes
router.get("/unapproved-users", authenticate, isAdmin, getUnapprovedUsers);
router.post("/approve-user", authenticate, isAdmin, approveUser);
router.post("/reject-user", authenticate, isAdmin, rejectUser);

module.exports = router;
