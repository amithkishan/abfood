# 🍱 AB Food Service — Backend API

Node.js + Express REST API powering the AB Food Service frontend.

---

## Quick Start

```bash
npm install
cp .env.example .env        # edit JWT_SECRET
npm run dev                 # starts with nodemon on port 3000
```

---

## API Reference

Base URL: `http://localhost:3000/api`

All protected routes require the header:
```
Authorization: Bearer <token>
```

---

### 🔐 Auth

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Login, get token |
| GET | `/auth/me` | ✅ | Get current user |

**Register**
```json
POST /auth/register
{ "name": "Arjun", "email": "arjun@example.com", "password": "secret123", "phone": "+91 98765 43210" }
```

**Login**
```json
POST /auth/login
{ "email": "arjun@example.com", "password": "secret123" }
```
Response includes `{ token, user }`.

---

### 🍽 Menu

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/menu` | No | All items |
| GET | `/menu?category=burgers` | No | Filter by category |
| GET | `/menu?search=chicken` | No | Search items |
| GET | `/menu/categories` | No | List categories |
| GET | `/menu/:id` | No | Single item |

**Categories:** `burgers`, `pizza`, `sushi`, `bowls`, `pasta`, `desserts`, `drinks`

---

### 🛒 Cart

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/cart` | ✅ | Get cart + totals |
| POST | `/cart/add` | ✅ | Add item |
| PATCH | `/cart/update` | ✅ | Set exact quantity |
| DELETE | `/cart/:itemId` | ✅ | Remove one item |
| DELETE | `/cart` | ✅ | Clear cart |

**Add to cart**
```json
POST /cart/add
{ "itemId": 1, "quantity": 2 }
```

**Cart response shape**
```json
{
  "items": [{ "itemId": 1, "name": "Classic Cheeseburger", "quantity": 2, "lineTotal": 458 }],
  "subtotal": 458,
  "deliveryFee": 49,
  "total": 507,
  "itemCount": 2
}
```

---

### 📦 Orders

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/orders` | ✅ | Place order from cart |
| GET | `/orders` | ✅ | My order history |
| GET | `/orders/:id` | ✅ | Single order detail |

**Place order**
```json
POST /orders
{
  "firstName": "Arjun",
  "lastName": "Shah",
  "address": "123 MG Road",
  "city": "Surat",
  "zip": "395001",
  "phone": "+91 98765 43210",
  "note": "Leave at door",
  "paymentMethod": "Cash on Delivery"
}
```

Payment methods: `"Credit / Debit Card"`, `"Cash on Delivery"`, `"UPI / Wallet"`

---

## Frontend Integration

Replace the `placeOrder()` function in your HTML with an API call:

```js
const BASE = "http://localhost:3000/api";
let token = null;

// Login example
async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  token = data.token;
}

// Add to cart via API
async function addToCartAPI(itemId) {
  await fetch(`${BASE}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ itemId }),
  });
}

// Place order
async function placeOrderAPI(deliveryDetails) {
  const res = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify(deliveryDetails),
  });
  return res.json();
}
```

---

## Project Structure

```
src/
├── index.js              # App entry point & route mounting
├── middleware/
│   └── jwt.js            # JWT authentication middleware
├── models/
│   └── store.js          # In-memory data store (swap for DB)
└── routes/
    ├── auth.js           # /api/auth/*
    ├── menu.js           # /api/menu/*
    ├── cart.js           # /api/cart/*
    └── orders.js         # /api/orders/*
```

## Upgrading to a Real Database

The `store.js` file is the only place with data logic. To switch to MongoDB or PostgreSQL:
1. Replace array operations in `store.js` with DB queries
2. Add a DB connection in `src/config/db.js`
3. No route files need to change