const router = require("express").Router();
const Order = require("../models/Order");

// CREATE ORDER
router.post("/create", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.json({ message: "Order saved", order });
  } catch (err) {
    res.status(500).json({ message: "Error saving order" });
  }
});

// GET ALL ORDERS (ADMIN - with summary fields)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });

    const formatted = orders.map((o) => ({
      _id: o._id,
      user: o.user,
      email: o.user?.email,
      address: o.address,
      items: o.items || [],
      total: o.total,
      finalAmount: o.finalAmount,
      status: o.status,
      date: o.date,
      itemsCount: o.items?.length || 0,
      payment: o.payment,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// GET ORDERS BY USER
router.get("/user/:email", async (req, res) => {
  try {
    const orders = await Order.find({ "user.email": req.params.email }).sort({ date: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user orders" });
  }
});

// ADMIN DASHBOARD STATS
router.get("/stats/summary", async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.finalAmount || 0),
      0
    );
    const pending = orders.filter((o) => o.status === "Pending").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;

    res.json({
      totalOrders,
      totalRevenue,
      pending,
      delivered,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// UPDATE ORDER STATUS (ADMIN CONTROL)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    await Order.findByIdAndUpdate(req.params.id, { status });

    res.json({ message: "Order status updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating order" });
  }
});

// GET SINGLE ORDER (DETAIL PAGE)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order" });
  }
});

module.exports = router;
