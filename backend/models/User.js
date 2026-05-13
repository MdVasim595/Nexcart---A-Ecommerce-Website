const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  otp: String,
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