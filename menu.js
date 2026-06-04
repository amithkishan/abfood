const express = require("express");
const store   = require("../models/store");
const router  = express.Router();

const VALID_CATEGORIES = ["burgers", "pizza", "sushi", "bowls", "pasta", "desserts", "drinks"];

/**
 * GET /api/menu
 * Query params:
 *   ?category=burgers   — filter by category
 *   ?search=chicken     — search by name/desc
 * Returns array of menu items.
 */
router.get("/", (req, res) => {
  let items = [...store.menuItems];
  const { category, search } = req.query;

  if (category) {
    if (!VALID_CATEGORIES.includes(category))
      return res.status(400).json({ error: `Invalid category. Valid: ${VALID_CATEGORIES.join(", ")}` });
    items = items.filter(i => i.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.desc.toLowerCase().includes(q)
    );
  }

  res.json({ count: items.length, items });
});

/**
 * GET /api/menu/categories
 * Returns the list of available categories.
 */
router.get("/categories", (req, res) => {
  res.json({ categories: VALID_CATEGORIES });
});

/**
 * GET /api/menu/:id
 * Returns a single menu item.
 */
router.get("/:id", (req, res) => {
  const item = store.menuItems.find(i => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Menu item not found" });
  res.json(item);
});

module.exports = router;