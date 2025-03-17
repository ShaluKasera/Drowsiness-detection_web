const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sendForgotPasswordMail,
  sendNewSignupUserDetailsToAdmin,
  sentApprovedMailToUser,
} = require("../utils/emailSend");

const signup = async (req, res) => {
  const { name, dob, phone, email, password, gender, role } = req.body;
  if (!name) return res.json({ success: false, msg: "Name is required." });
  if (!dob)
    return res.json({ success: false, msg: "Date of birth is required." });
  if (!phone)
    return res.json({ success: false, msg: "Phone number is required." });
  if (!email) return res.json({ success: false, msg: "Email is required." });
  if (!password)
    return res.json({ success: false, msg: "Password is required." });
  if (!gender) return res.json({ success: false, msg: "Gender is required." });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User already exists. Please log in." });
    }

    const isValidPassword = (password, name) => {
      return (
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password) &&
        /[\W_]/.test(password) &&
        password.length >= 6 &&
        password.length <= 10 &&
        !password.toLowerCase().includes(name.toLowerCase())
      );
    };

    if (!isValidPassword(password, name)) {
      return res.status(401).json({
        message:
          "Password must be 6-10 chars long, include uppercase, lowercase, digit, special character, and not contain your name.",
      });
    }

    // Store the user with OTP and unverified status
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      dob,
      phone,
      email,
      password: hashedPassword,
      gender,
      role: role === "admin" ? "admin" : "user", // Assign "admin" only if explicitly set
      isApproved: false, // Admin approval required
    });

    await newUser.save();

    await sendNewSignupUserDetailsToAdmin(name, email, role);

    return res.status(201).json({
      msg: "Successfully signup",
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: `Internal server error from user signup: ${error}` });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    // Check if user is approved
    if (!user.isApproved) {
      return res.status(403).json({ msg: "Account not approved by admin" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(401).json({ msg: "password not matched" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET,
      {
        expiresIn: "1y",
      }
    );
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ msg: `server error ${error}` });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.SECRET, {
      expiresIn: "1h",
    });

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1-hour expiry
    await user.save();

    console.log(resetToken);

    // Send password reset email
    const emailSent = await sendForgotPasswordMail(user.email, resetToken);

    if (emailSent) {
      return res
        .status(200)
        .json({ message: "Password reset email sent successfully" });
    } else {
      return res
        .status(500)
        .json({ msg: "Failed to send password reset email" });
    }
  } catch (error) {
    return res.status(500).json({ msg: `Server error: ${error.message}` });
  }
};

const handleResetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  try {
    if (!resetToken) {
      return res.status(400).json({ message: "Reset token is required" });
    }
    const decoded = jwt.verify(resetToken, process.env.SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const isValidPassword = (password, name) => {
      return (
        /[A-Z]/.test(password) && // At least one uppercase letter
        /[a-z]/.test(password) && // At least one lowercase letter
        /\d/.test(password) && // At least one digit
        /[\W_]/.test(password) && // At least one special character
        password.length >= 6 &&
        password.length <= 10 &&
        (!name || !password.toLowerCase().includes(name.toLowerCase())) // Ensure name is not in password
      );
    };

    if (!isValidPassword(newPassword, user.name)) {
      return res.status(401).json({
        message:
          "Password must be 6-10 chars long, include uppercase, lowercase, digit, special character, and must not contain your name.",
      });
    }
    // Update Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ msg: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password: ", error);
    return res
      .status(500)
      .json({ msg: `Server error from handleResetPassword : ${error}` });
  }
};

const getUnapprovedUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching unapproved users:", error);
    res.status(500).json({ msg: `Internal server error: ${error}` });
  }
};

const approveUser = async (req, res) => {
  const { email, name } = req.body;
  const adminId = req.user.id; // Ensure this is an admin

  try {
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    // Ensure we are approving only regular users, not admins
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ msg: "User not found or not eligible for approval" });
    }

    if (user.isApproved) {
      return res.status(400).json({ msg: "User is already approved" });
    }

    user.isApproved = true;
    await user.save();
    // await sendApprovedMailToUser(user.email, user.name);
    await sentApprovedMailToUser(email, name);

    res.status(200).json({ msg: "User approved successfully" });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ msg: `Internal server error: ${error}` });
  }
};

const rejectUser = async (req, res) => {
  const { email } = req.body;
  const adminId = req.user.id;

  try {
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found or already deleted.");
      return;
    }

    // Send rejection email before deleting the user
    // await sendRejectionMailToUser(user.email, user.name);

    await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "User rejected and deleted successfully" });
  } catch (error) {
    console.error("Error rejecting user:", error);
    res.status(500).json({ msg: `Internal server error: ${error}` });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  handleResetPassword,
  getUnapprovedUsers,
  rejectUser,
  approveUser,
  getUserDetails,
};
