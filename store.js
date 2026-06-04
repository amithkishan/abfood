// ─── In-memory store ───
// To switch to a real DB, replace reads/writes below with DB queries.

const store = {
  users: [],

  // Exact menu items from the AB Food Service frontend
  menuItems: [
    { id: 1,  name: "Classic Cheeseburger",  desc: "Juicy beef patty, cheddar, lettuce, tomato & special sauce", price: 229, emoji: "🍔", category: "burgers",  badge: "Best Seller" },
    { id: 2,  name: "Crispy Chicken Burger",  desc: "Fried chicken thigh, coleslaw, pickles & spicy mayo",        price: 199, emoji: "🍗", category: "burgers",  badge: null },
    { id: 3,  name: "BBQ Smash Burger",       desc: "Double smash patty, bacon, BBQ sauce & onion rings",         price: 279, emoji: "🥩", category: "burgers",  badge: "New" },
    { id: 4,  name: "Margherita Pizza",       desc: "San Marzano tomato, fresh mozzarella & basil",               price: 299, emoji: "🍕", category: "pizza",    badge: null },
    { id: 5,  name: "Pepperoni Feast",        desc: "Loaded with premium pepperoni & mozzarella",                 price: 349, emoji: "🍕", category: "pizza",    badge: "Popular" },
    { id: 6,  name: "BBQ Chicken Pizza",      desc: "Grilled chicken, BBQ drizzle & caramelised onion",           price: 329, emoji: "🍕", category: "pizza",    badge: null },
    { id: 7,  name: "Salmon Nigiri Set",      desc: "6-piece premium salmon nigiri with soy & wasabi",            price: 449, emoji: "🍣", category: "sushi",    badge: "Chef's Pick" },
    { id: 8,  name: "Dragon Roll",            desc: "Prawn tempura, avocado, eel sauce & sesame",                 price: 399, emoji: "🍱", category: "sushi",    badge: null },
    { id: 9,  name: "Spicy Tuna Roll",        desc: "Spicy tuna, cucumber, sriracha mayo",                        price: 369, emoji: "🍣", category: "sushi",    badge: null },
    { id: 10, name: "Teriyaki Chicken Bowl",  desc: "Grilled chicken, steamed rice, teriyaki glaze & sesame",     price: 249, emoji: "🥗", category: "bowls",    badge: null },
    { id: 11, name: "Acai Power Bowl",        desc: "Acai blend, granola, banana, berries & honey",               price: 229, emoji: "🫐", category: "bowls",    badge: "Healthy" },
    { id: 12, name: "Spaghetti Bolognese",    desc: "Slow-cooked beef ragù with al dente spaghetti",              price: 279, emoji: "🍝", category: "pasta",    badge: null },
    { id: 13, name: "Creamy Fettuccine",      desc: "Creamy alfredo with parmesan & black pepper",                price: 259, emoji: "🍝", category: "pasta",    badge: null },
    { id: 14, name: "Tiramisu",               desc: "Classic Italian tiramisu with espresso & mascarpone",        price: 149, emoji: "🍰", category: "desserts", badge: null },
    { id: 15, name: "Chocolate Lava Cake",    desc: "Warm cake with molten dark chocolate centre",                price: 169, emoji: "🎂", category: "desserts", badge: "Fan Fav" },
    { id: 16, name: "Mango Lassi",            desc: "Fresh mango, yoghurt & a hint of cardamom",                 price: 99,  emoji: "🥭", category: "drinks",   badge: null },
    { id: 17, name: "Blue Lagoon Soda",       desc: "Tropical blue citrus soda with a citrus twist",             price: 89,  emoji: "🥤", category: "drinks",   badge: null },
  ],

  // carts: keyed by userId → { itemId: quantity }
  carts: {},

  // orders array
  orders: [],
};

module.exports = store;