const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  otpHash: { type: String, select: false },
  otpExpiresAt: { type: Date, select: false },
  otpAttempts: { type: Number, default: 0, select: false },
  isVerified: { type: Boolean, default: false },
   name: String,
  phone: String,

  addresses: [],
  orders: [],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  payout: {
  accountName: String,
  bankName: String,
  accountNumber: String,
  ifsc: String,
  upi: String,
},
});

module.exports = mongoose.model("User", userSchema);
