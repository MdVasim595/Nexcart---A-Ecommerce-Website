const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  price: { type: Number, required: true, min: 0.01, max: 10000000 },
  description: { type: String, maxlength: 5000 },
  image: { type: String, maxlength: 2000 },
  category: { type: String, trim: true, maxlength: 100 },
  sizes: [String],
  featured: {
  type: Boolean,
  default: false,
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
