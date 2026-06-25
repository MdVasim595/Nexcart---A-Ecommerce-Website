const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.get("authorization") || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "nexcart-api",
      audience: "nexcart-web",
    });
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

function requireAdmin(req, res, next) {
  return requireAuth(req, res, () => {
    if (req.auth.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    return next();
  });
}

module.exports = { requireAuth, requireAdmin };
