const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();
const otpDigest = (email, otp) => crypto.createHmac("sha256", process.env.JWT_SECRET).update(`${email}:${otp}`).digest("hex");

router.post("/send-otp", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    await User.findOneAndUpdate(
      { email },
      {
        $set: { otpHash: otpDigest(email, otp), otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), otpAttempts: 0 },
        $setOnInsert: { email },
        $unset: { otp: "" },
      },
      { upsert: true, new: true, runValidators: true }
    );
    await sendEmail(email, otp);
    return res.json({ message: "If the address can receive email, an OTP has been sent" });
  } catch (error) {
    return next(error);
  }
});

router.post("/verify-otp", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || "");
    const user = await User.findOne({ email }).select("+otpHash +otpExpiresAt +otpAttempts");

    if (!user || !user.otpHash || user.otpExpiresAt <= new Date() || user.otpAttempts >= 5) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const supplied = Buffer.from(otpDigest(email, otp), "hex");
    const expected = Buffer.from(user.otpHash, "hex");
    if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    await user.save();

    const token = jwt.sign(
      { sub: String(user._id), email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: "2h", issuer: "nexcart-api", audience: "nexcart-web" }
    );
    return res.json({ message: "Login success", token, user: { _id: user._id, email: user.email, name: user.name, phone: user.phone } });
  } catch (error) {
    return next(error);
  }
});

router.post("/admin-login", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const [saltHex, expectedHex] = String(process.env.ADMIN_PASSWORD_HASH || "").split(":");
    if (!saltHex || !expectedHex || email !== normalizeEmail(process.env.ADMIN_EMAIL)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const supplied = await new Promise((resolve, reject) => {
      crypto.scrypt(String(req.body.password || ""), Buffer.from(saltHex, "hex"), 64, (error, key) => error ? reject(error) : resolve(key));
    });
    const expected = Buffer.from(expectedHex, "hex");
    if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ sub: "admin", email, role: "admin" }, process.env.JWT_SECRET, {
      algorithm: "HS256", expiresIn: "1h", issuer: "nexcart-api", audience: "nexcart-web",
    });
    return res.json({ token });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
