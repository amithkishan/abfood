const express  = require("express");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const store    = require("../models/store");
const { authenticate, JWT_SECRET } = require("../middleware/jwt");

const router = express.Router();

/**
 * POST /api/auth/register
 * Body: { name, email, password, phone? }
 */
router.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "name, email and password are required" });

  if (store.users.find(u => u.email === email))
    return res.status(409).json({ error: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    name,
    email,
    phone: phone || null,
    password: hashed,
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  const { password: _, ...safe } = user;
  res.status(201).json({ token, user: safe });
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email and password are required" });

  const user = store.users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  const { password: _, ...safe } = user;
  res.json({ token, user: safe });
});

/**
 * GET /api/auth/me
 * Returns the logged-in user's profile.
 */
router.get("/me", authenticate, (req, res) => {
  const user = store.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { password: _, ...safe } = user;
  res.json(safe);
});

module.exports = router;