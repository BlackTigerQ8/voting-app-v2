const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: Number,
  idNumber: Number,
  password: String,
  idImage: String,
  otp: String,
  otpExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Document expires in 10 minutes
  },
});

module.exports = mongoose.model("TempUser", tempUserSchema);
