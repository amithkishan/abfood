const express = require("express");
const store   = require("./store");
const { authenticate } = require("./jwt");

const router = express.Router();
const DELIVERY_FEE = 49;

// All cart routes require a logged-in user
router.use(authenticate);

/** Helper: compute cart totals for a user */
function buildCartResponse(userId) {
  const userCart = store.carts[userId] || {};
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
      category:  menuItem.category,
      unitPrice: menuItem.price,
      quantity:  qty,
      lineTotal,
    });
  }

  return {
    items,
    subtotal,
    deliveryFee: DELIVERY_FEE,
    total: subtotal + DELIVERY_FEE,
    itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
  };
}

/**
 * GET /api/cart
 * Returns the current user's cart with totals.
 */
router.get("/", (req, res) => {
  res.json(buildCartResponse(req.user.id));
});

/**
 * POST /api/cart/add
 * Body: { itemId, quantity? }  — quantity defaults to 1
 * Adds (or increments) an item in the cart.
 */
router.post("/add", (req, res) => {
  const { itemId, quantity = 1 } = req.body;

  if (!itemId) return res.status(400).json({ error: "itemId is required" });
  if (quantity < 1) return res.status(400).json({ error: "quantity must be at least 1" });

  const menuItem = store.menuItems.find(m => m.id === Number(itemId));
  if (!menuItem) return res.status(404).json({ error: "Menu item not found" });

  const uid = req.user.id;
  if (!store.carts[uid]) store.carts[uid] = {};
  store.carts[uid][itemId] = (store.carts[uid][itemId] || 0) + quantity;

  res.json({ message: `${menuItem.name} added to cart`, cart: buildCartResponse(uid) });
});

/**
 * PATCH /api/cart/update
 * Body: { itemId, quantity }
 * Sets the exact quantity. If quantity <= 0, removes the item.
 */
router.patch("/update", (req, res) => {
  const { itemId, quantity } = req.body;
  if (!itemId || quantity === undefined)
    return res.status(400).json({ error: "itemId and quantity are required" });

  const menuItem = store.menuItems.find(m => m.id === Number(itemId));
  if (!menuItem) return res.status(404).json({ error: "Menu item not found" });

  const uid = req.user.id;
  if (!store.carts[uid]) store.carts[uid] = {};

  if (quantity <= 0) {
    delete store.carts[uid][itemId];
  } else {
    store.carts[uid][itemId] = quantity;
  }

  res.json({ message: "Cart updated", cart: buildCartResponse(uid) });
});

/**
 * DELETE /api/cart/:itemId
 * Removes a single item from the cart entirely.
 */
router.delete("/:itemId", (req, res) => {
  const uid = req.user.id;
  const { itemId } = req.params;

  if (!store.carts[uid] || !store.carts[uid][itemId])
    return res.status(404).json({ error: "Item not in cart" });

  delete store.carts[uid][itemId];
  res.json({ message: "Item removed from cart", cart: buildCartResponse(uid) });
});

/**
 * DELETE /api/cart
 * Clears the entire cart.
 */
router.delete("/", (req, res) => {
  store.carts[req.user.id] = {};
  res.json({ message: "Cart cleared", cart: buildCartResponse(req.user.id) });
});

module.exports = router;