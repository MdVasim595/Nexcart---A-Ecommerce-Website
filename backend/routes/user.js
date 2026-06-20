const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order");

// ✅ SAVE PAYOUT DETAILS
router.put("/payout", async (req, res) => {
  try {
    const { email, payout } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { payout } },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error saving payout" });
  }
});

// ✅ UPDATE USER
router.put("/update", async (req, res) => {
  try {
    const { email, name, phone, addresses } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (addresses !== undefined) updateData.addresses = addresses;

    const user = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});


// 🔥 ✅ ADMIN - GET ALL USERS WITH STATS
router.get("/admin/all", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    const data = await Promise.all(
      users.map(async (u) => {
        const orders = await Order.find({ "user.email": u.email });

        const totalOrders = orders.length;

        const totalSpend = orders.reduce(
          (sum, o) => sum + (o.finalAmount || 0),
          0
        );

        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          isVerified: u.isVerified,
          totalOrders,
          totalSpend,
          createdAt: u.createdAt,
        };
      })
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});


// 🔥 ✅ ADMIN - SINGLE USER FULL DETAIL (USER + ORDERS)
router.get("/admin/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    const orders = await Order.find({
      "user.email": req.params.email,
    }).sort({ date: -1 });

    const totalSpend = orders.reduce(
      (sum, o) => sum + (o.finalAmount || 0),
      0
    );

    res.json({
      user,
      orders,
      totalOrders: orders.length,
      totalSpend,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user detail" });
  }
});


// ✅ GET USER BY EMAIL (IMPORTANT: keep LAST)
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "User fetch failed" });
  }
});

module.exports = router;
