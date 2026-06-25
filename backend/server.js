require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const { paymentWebhook } = require("./controllers/paymentController");

const requiredEnv = ["MONGO_URI", "JWT_SECRET", "EMAIL_USER", "EMAIL_PASS", "RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD_HASH"];
const missing = requiredEnv.filter((name) => !process.env[name] || /^(your_|x+$)/i.test(process.env[name]));
if (missing.length) throw new Error(`Missing or placeholder environment variables: ${missing.join(", ")}`);
if (process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET must be at least 32 characters");

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet());

const origins = String(process.env.FRONTEND_ORIGINS || "http://localhost:5173").split(",").map((value) => value.trim());
app.use(cors({ origin(origin, callback) { callback(null, !origin || origins.includes(origin)); }, methods: ["GET", "POST", "PUT", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"] }));

app.post("/api/payment/webhook", express.raw({ type: "application/json", limit: "256kb" }), paymentWebhook);
app.use(express.json({ limit: "100kb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 }), require("./routes/auth"));
app.use("/api/order", require("./routes/order"));
app.use("/api/product", require("./routes/product"));
app.use("/api/user", require("./routes/user"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.status || (error.name === "ValidationError" ? 400 : 500);
  return res.status(status).json({ message: status >= 500 ? "Internal server error" : error.message });
});

const PORT = Number(process.env.PORT) || 5000;
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((error) => {
  console.error("Database connection failed", error);
  process.exitCode = 1;
});
