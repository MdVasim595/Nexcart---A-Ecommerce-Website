const mongoose = require("mongoose");
const Product = require("../models/product");

async function priceItems(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 50) {
    const error = new Error("Cart must contain between 1 and 50 items");
    error.status = 400;
    throw error;
  }

  const requested = rawItems.map((item) => ({
    id: String(item?._id || item?.id || ""),
    selectedSize: typeof item?.selectedSize === "string" ? item.selectedSize.slice(0, 50) : null,
  }));

  if (requested.some((item) => !mongoose.isValidObjectId(item.id))) {
    const error = new Error("Cart contains an invalid product");
    error.status = 400;
    throw error;
  }

  const products = await Product.find({ _id: { $in: [...new Set(requested.map((i) => i.id))] } }).lean();
  const byId = new Map(products.map((product) => [String(product._id), product]));

  if (requested.some((item) => !byId.has(item.id))) {
    const error = new Error("One or more products are no longer available");
    error.status = 409;
    throw error;
  }

  const items = requested.map(({ id, selectedSize }) => {
    const product = byId.get(id);
    if (product.sizes?.length && (!selectedSize || !product.sizes.includes(selectedSize))) {
      const error = new Error(`Select a valid size for ${product.title}`);
      error.status = 400;
      throw error;
    }
    return {
      product: product._id,
      title: product.title,
      price: Number(product.price),
      image: product.image,
      selectedSize,
    };
  });

  const total = items.reduce((sum, item) => sum + item.price, 0);
  if (!Number.isSafeInteger(Math.round(total * 100)) || total <= 0) {
    const error = new Error("Invalid cart total");
    error.status = 400;
    throw error;
  }
  return { items, total: Number(total.toFixed(2)) };
}

function cleanCheckout({ address, resell, margin, brandName }) {
  const required = ["name", "phone", "house", "area", "city", "state", "pincode"];
  if (!address || required.some((key) => typeof address[key] !== "string" || !address[key].trim())) {
    const error = new Error("A complete delivery address is required");
    error.status = 400;
    throw error;
  }
  const cleanAddress = Object.fromEntries(required.map((key) => [key, address[key].trim().slice(0, 150)]));
  const isResell = resell === true;
  const cleanMargin = isResell ? Number(margin) : 0;
  if (!Number.isFinite(cleanMargin) || cleanMargin < 0 || cleanMargin > 100000) {
    const error = new Error("Invalid reseller margin");
    error.status = 400;
    throw error;
  }
  if (isResell && (typeof brandName !== "string" || !brandName.trim())) {
    const error = new Error("Brand name is required for reseller orders");
    error.status = 400;
    throw error;
  }
  return { address: cleanAddress, resell: isResell, margin: cleanMargin, brandName: isResell ? brandName.trim().slice(0, 100) : null };
}

module.exports = { priceItems, cleanCheckout };
