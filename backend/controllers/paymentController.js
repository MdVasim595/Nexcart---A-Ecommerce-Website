const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");
const { priceItems, cleanCheckout } = require("../utils/orderPricing");

const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

function signaturesMatch(payload, signature, secret) {
  if (!signature || !secret) return false;
  const expected = Buffer.from(crypto.createHmac("sha256", secret).update(payload).digest("hex"), "utf8");
  const supplied = Buffer.from(String(signature), "utf8");
  return expected.length === supplied.length && crypto.timingSafeEqual(expected, supplied);
}

exports.createOrder = async (req, res, next) => {
  try {
    const { items, total } = await priceItems(req.body.items);
    const checkout = cleanCheckout(req.body);
    const finalAmount = Number((total + checkout.margin).toFixed(2));
    const amount = Math.round(finalAmount * 100);
    const receipt = `nc_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    const gatewayOrder = await razorpay.orders.create({ amount, currency: "INR", receipt });
    const order = await Order.create({
      user: { id: req.auth.sub, email: req.auth.email }, items, ...checkout,
      payment: "Online", total, finalAmount, paymentStatus: "Pending", razorpayOrderId: gatewayOrder.id,
    });

    return res.status(201).json({
      key: process.env.RAZORPAY_KEY_ID,
      orderId: gatewayOrder.id,
      amount: gatewayOrder.amount,
      currency: gatewayOrder.currency,
      localOrderId: order._id,
    });
  } catch (error) {
    return next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body;
    if (![orderId, paymentId, signature].every((value) => typeof value === "string" && value.length < 200)) {
      return res.status(400).json({ success: false, message: "Invalid payment response" });
    }
    if (!signaturesMatch(`${orderId}|${paymentId}`, signature, process.env.RAZORPAY_KEY_SECRET)) {
      return res.status(400).json({ success: false, message: "Payment signature verification failed" });
    }

    const order = await Order.findOne({ razorpayOrderId: orderId, "user.id": req.auth.sub });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.paymentStatus === "Paid" && order.razorpayPaymentId === paymentId) {
      return res.json({ success: true, order });
    }
    const duplicate = await Order.exists({ razorpayPaymentId: paymentId, _id: { $ne: order._id } });
    if (duplicate) return res.status(409).json({ success: false, message: "Payment is already linked to another order" });

    let payment = await razorpay.payments.fetch(paymentId);
    const expectedAmount = Math.round(order.finalAmount * 100);
    if (payment.order_id !== orderId || payment.amount !== expectedAmount || payment.currency !== "INR") {
      return res.status(400).json({ success: false, message: "Payment details do not match this order" });
    }
    if (payment.status === "authorized") {
      payment = await razorpay.payments.capture(paymentId, expectedAmount, "INR");
    }
    if (payment.status !== "captured") {
      return res.status(409).json({ success: false, message: `Payment is ${payment.status}, not captured` });
    }

    order.paymentStatus = "Paid";
    order.razorpayPaymentId = paymentId;
    order.status = "Confirmed";
    await order.save();
    return res.json({ success: true, order });
  } catch (error) {
    return next(error);
  }
};

exports.paymentWebhook = async (req, res, next) => {
  try {
    const signature = req.get("x-razorpay-signature");
    if (!signaturesMatch(req.body.toString("utf8"), signature, process.env.RAZORPAY_WEBHOOK_SECRET)) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }
    const event = JSON.parse(req.body.toString("utf8"));
    const payment = event.payload?.payment?.entity;
    if (!payment?.order_id) return res.json({ received: true });

    const order = await Order.findOne({ razorpayOrderId: payment.order_id });
    if (!order || payment.amount !== Math.round(order.finalAmount * 100) || payment.currency !== "INR") {
      return res.json({ received: true });
    }
    if (event.event === "payment.captured") {
      const duplicate = await Order.exists({ razorpayPaymentId: payment.id, _id: { $ne: order._id } });
      if (!duplicate) {
        order.paymentStatus = "Paid";
        order.razorpayPaymentId = payment.id;
        order.status = "Confirmed";
        await order.save();
      }
    } else if (event.event === "payment.failed" && order.paymentStatus !== "Paid") {
      order.paymentStatus = "Failed";
      await order.save();
    }
    return res.json({ received: true });
  } catch (error) {
    return next(error);
  }
};
