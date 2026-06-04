const express = require("express");
const { v4: uuidv4 } = require("uuid");
const store   = require("../models/store");
const { authenticate } = require("../middleware/jwt");

const router = express.Router();
const DELIVERY_FEE = 49;

// All order routes require authentication
router.use(authenticate);

/**
 * POST /api/orders
 * Places an order from the user's current cart.
 * Body: {
 *   firstName, lastName, address, city, zip, phone,
 *   note?,
 *   paymentMethod: "Credit / Debit Card" | "Cash on Delivery" | "UPI / Wallet",
 *   cardNumber?, expiry?, cvv?   (required if paymentMethod is card)
 * }
 */
router.post("/", (req, res) => {
  const uid = req.user.id;
  const userCart = store.carts[uid] || {};

  if (Object.keys(userCart).length === 0)
    return res.status(400).json({ error: "Cannot place an order with an empty cart" });

  const { firstName, lastName, address, city, zip, phone, note, paymentMethod } = req.body;
  if (!firstName || !address || !city || !zip || !phone || !paymentMethod)
    return res.status(400).json({ error: "firstName, address, city, zip, phone and paymentMethod are required" });

  // Build order items snapshot (prices locked at order time)
  const items = [];
  let subtotal = 0;
  for (const [idStr, qty] of Object.entries(userCart)) {
    const menuItem = store.menuItems.find(m => m.id === Number(idStr));
    if (!menuItem) continue;
    const lineTotal = menuItem.price * qty;
    subtotal += lineTotal;
    items.push({
      itemId:    menuItem.id,
      name:      menuItem.name,
      emoji:     menuItem.emoji,
      unitPrice: menuItem.price,
      quantity:  qty,
      lineTotal,
    });
  }

  const order = {
    id:          uuidv4(),
    userId:      uid,
    status:      "confirmed",          // confirmed → preparing → out_for_delivery → delivered
    items,
    delivery: {
      firstName,
      lastName: lastName || "",
      address,
      city,
      zip,
      phone,
      note: note || "",
    },
    payment: {
      method: paymentMethod,
      // Never store real card details — masked here for demo only
      cardLast4: paymentMethod === "Credit / Debit Card" && req.body.cardNumber
        ? String(req.body.cardNumber).replace(/\s/g, "").slice(-4)
        : null,
    },
    subtotal,
    deliveryFee: DELIVERY_FEE,
    total: subtotal + DELIVERY_FEE,
    estimatedDelivery: "30-45 minutes",
    createdAt: new Date().toISOString(),
  };

  store.orders.push(order);

  // Clear the cart after successful order
  store.carts[uid] = {};

  res.status(201).json({ message: "Order placed successfully! 🎉", order });
});

/**
 * GET /api/orders
 * Returns all orders for the logged-in user, newest first.
 */
router.get("/", (req, res) => {
  const userOrders = store.orders
    .filter(o => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ count: userOrders.length, orders: userOrders });
});

/**
 * GET /api/orders/:id
 * Returns a single order (only if it belongs to the user).
 */
router.get("/:id", (req, res) => {
  const order = store.orders.find(o => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

module.exports = router;