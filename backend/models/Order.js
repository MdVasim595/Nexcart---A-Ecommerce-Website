const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    email: String,
  },
  items: [],
  address: {},
  payment: String,

  total: Number,
  finalAmount: Number,

  resell: Boolean,
  margin: Number,
  brandName: String,

  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);