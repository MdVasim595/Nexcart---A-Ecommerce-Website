const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
  },
  items: [],
  address: {},
  payment: String,

  total: Number,
  finalAmount: Number,

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Pending",
  },

  razorpayOrderId: { type: String, index: true, sparse: true },

  razorpayPaymentId: { type: String, index: true, sparse: true },

  resell: Boolean,
  margin: Number,
  brandName: String,

  status: { type: String, enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
