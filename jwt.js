const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "ab-food-secret-key";

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header. Expected: Bearer <token>" });
  }
  try {
    req.user = jwt.verify(header.split(" ")[1], JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Token expired or invalid" });
  }
}

module.exports = { authenticate, JWT_SECRET };
