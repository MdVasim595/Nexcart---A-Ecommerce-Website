const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.sub).select("-otp -otpHash -otpExpiresAt -otpAttempts");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (error) { return next(error); }
});

router.put("/update", requireAuth, async (req, res, next) => {
  try {
    const update = {};
    if (typeof req.body.name === "string") update.name = req.body.name.trim().slice(0, 100);
    if (typeof req.body.phone === "string") update.phone = req.body.phone.trim().slice(0, 20);
    if (Array.isArray(req.body.addresses) && req.body.addresses.length <= 10) update.addresses = req.body.addresses;
    const user = await User.findByIdAndUpdate(req.auth.sub, { $set: update }, { new: true, runValidators: true }).select("-otpHash");
    return res.json(user);
  } catch (error) { return next(error); }
});

router.put("/payout", requireAuth, async (req, res, next) => {
  try {
    const payout = req.body.payout;
    if (!payout || typeof payout !== "object") return res.status(400).json({ message: "Invalid payout details" });
    const allowed = ["accountName", "bankName", "accountNumber", "ifsc", "upi"];
    const clean = Object.fromEntries(allowed.map((key) => [key, String(payout[key] || "").trim().slice(0, 100)]));
    const user = await User.findByIdAndUpdate(req.auth.sub, { $set: { payout: clean } }, { new: true, runValidators: true });
    return res.json(user);
  } catch (error) { return next(error); }
});

router.get("/admin/all", requireAdmin, async (_req, res, next) => {
  try {
    const users = await User.find().select("-payout").sort({ createdAt: -1 }).lean();
    const data = await Promise.all(users.map(async (user) => {
      const orders = await Order.find({ "user.id": user._id }).lean();
      return { ...user, totalOrders: orders.length, totalSpend: orders.filter((o) => o.payment === "COD" || o.paymentStatus === "Paid").reduce((sum, o) => sum + (o.finalAmount || 0), 0) };
    }));
    return res.json(data);
  } catch (error) { return next(error); }
});

router.get("/admin/:email", requireAdmin, async (req, res, next) => {
  try {
    const user = await User.findOne({ email: String(req.params.email).toLowerCase() }).select("-payout").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    const orders = await Order.find({ "user.id": user._id }).sort({ date: -1 }).lean();
    return res.json({ user, orders, totalOrders: orders.length, totalSpend: orders.reduce((sum, order) => sum + (order.finalAmount || 0), 0) });
  } catch (error) { return next(error); }
});

module.exports = router;
