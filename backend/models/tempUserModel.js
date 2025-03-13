const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const tempUserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  idNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  idImage: String,
  otp: {
    type: String,
    required: true,
  },
  otpExpires: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Document expires after 10 minutes
  },
});

// // Hash password before saving
// tempUserSchema.pre("save", async function (next) {
//   // Only run this function if password was actually modified
//   if (!this.isModified("password")) return next();
//   // Generate a salt and hash the password
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   //   Delete passwordConfirm field
//   this.confirmPassword = undefined;

//   // To remove commas from identification number
//   if (this.idNumber && typeof this.idNumber === "string") {
//     this.idNumber = this.idNumber.replace(/,/g, "");
//   }
//   next();
// });

const TempUser = mongoose.model("TempUser", tempUserSchema);

module.exports = { TempUser };
