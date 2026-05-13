import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) return alert("Enter email");

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/auth/send-otp", { email });

      alert("OTP sent to your email 📩"); // 👈 important
      setStep(2);

    } catch (err) {
      console.log(err);
      alert("Failed to send OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }
      );

      console.log("SUCCESS:", res.data); // 👈 add this

      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.reload();
      nav("/");
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message); // 👈 add this
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center">

      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden">

        {/* TOP BANNER */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 text-white">
          <h2 className="text-xl font-semibold">Great Quality</h2>
          <p className="text-sm">Lowest Prices</p>
        </div>

        {/* CONTENT */}
        <div className="p-6">

          <h2 className="text-lg font-semibold mb-4">
            Sign Up to view your profile
          </h2>

          {step === 1 && (
            <>
              <label className="text-sm text-gray-500">Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-pink-500 py-2 mb-6"
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold"
              >
                {loading ? "Sending..." : "Continue"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <label className="text-sm text-gray-500">Enter OTP</label>

              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-pink-500 py-2 mb-6"
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                onClick={verifyOtp}
                className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold"
              >
                Verify OTP
              </button>
            </>
          )}

          {/* TERMS */}
          <p className="text-xs text-gray-400 mt-6 text-center">
            By continuing, you agree to Terms & Conditions and Privacy Policy
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;