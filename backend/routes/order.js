const router = require("express").Router();
const Order = require("../models/Order");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { priceItems, cleanCheckout } = require("../utils/orderPricing");

router.post("/create", requireAuth, async (req, res, next) => {
  try {
    if (req.body.payment && req.body.payment !== "COD") {
      return res.status(400).json({ message: "Online orders must be created through the payment API" });
    }
    const { items, total } = await priceItems(req.body.items);
    const checkout = cleanCheckout(req.body);
    const order = await Order.create({
      user: { id: req.auth.sub, email: req.auth.email }, items, ...checkout,
      payment: "COD", total, finalAmount: Number((total + checkout.margin).toFixed(2)), paymentStatus: "Pending",
    });
    return res.status(201).json({ message: "Order saved", order });
  } catch (error) {
    return next(error);
  }
});

router.get("/mine", requireAuth, async (req, res, next) => {
  try {
    return res.json(await Order.find({ "user.id": req.auth.sub }).sort({ date: -1 }));
  } catch (error) { return next(error); }
});

router.get("/", requireAdmin, async (_req, res, next) => {
  try { return res.json(await Order.find().sort({ date: -1 })); }
  catch (error) { return next(error); }
});

router.get("/stats/summary", requireAdmin, async (_req, res, next) => {
  try {
    const orders = await Order.find().lean();
    return res.json({
      totalOrders: orders.length,
      totalRevenue: orders.filter((o) => o.payment === "COD" || o.paymentStatus === "Paid").reduce((sum, o) => sum + (o.finalAmount || 0), 0),
      pending: orders.filter((o) => o.status === "Pending").length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
    });
  } catch (error) { return next(error); }
});

router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const allowed = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid order status" });
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json({ message: "Order status updated", order });
  } catch (error) { return next(error); }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const query = req.auth.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, "user.id": req.auth.sub };
    const order = await Order.findOne(query);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (error) { return next(error); }
});

module.exports = router;
