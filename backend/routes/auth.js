const router = require("express").Router();
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// SEND OTP
router.post("/send-otp", async (req, res) => {
  console.log("API HIT 🔥");
  const { email } = req.body;

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ email, otp });
  } else {
    user.otp = otp;
  }

  await user.save();
  await sendEmail(email, otp);

  res.json({ message: "OTP sent to email" });
});

// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  console.log("EMAIL:", email);
  console.log("ENTERED OTP:", otp);
  console.log("DB OTP:", user?.otp);

  if (!user || user.otp != otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.isVerified = true;
  await user.save();

  res.json({ message: "Login success", user });
});

module.exports = router;