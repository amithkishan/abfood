const express = require("express");
const cors = require("cors");

const authRoutes  = require("./auth");
const menuRoutes  = require("./menu");
const cartRoutes  = require("./cart");
const orderRoutes = require("./orders");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use("/api/auth",   authRoutes);
app.use("/api/menu",   menuRoutes);
app.use("/api/cart",   cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "AB Food Service API" }));

app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.path} not found` }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🍱 AB Food Service API running at http://localhost:${PORT}`);
});