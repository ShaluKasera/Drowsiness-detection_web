const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender:{
      type:String,
      enum:["male","female","others"]
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiration: {
      type: Date,
    },
    
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
