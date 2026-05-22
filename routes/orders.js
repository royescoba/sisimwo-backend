const express = require("express");
const router  = express.Router();
const Order   = require("../models/Order");
const { sendOrderConfirmation, sendAdminOrderAlert } = require("../utils/mailer");

// POST /api/orders
// Body: { customerName, customerEmail, customerPhone, items: [{id,name,category,price,unit,qty}] }
router.post("/", async (req, res) => {
  const { customerName, customerEmail, customerPhone, items } = req.body;

  if (!customerName || !customerEmail) {
    return res.status(400).json({ error: "Name and email are required." });
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty." });
  }

  // Calculate total server-side — never trust the client for money
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  try {
    const order = await Order.create({
      customerName,
      customerEmail,
      customerPhone,
      items,
      total,
    });

    // Fire both emails concurrently; don't block the response if email fails
   Promise.all([
    sendOrderConfirmation(order),
    sendAdminOrderAlert(order),
    ]).then(() => console.log("Emails sent successfully"))
  .catch(err => console.error("Order email error:", err.message));

    res.status(201).json({
      message: "Order placed successfully.",
      orderId: order._id,
      total,
    });
  } catch (err) {
    console.error("Order save error:", err.message);
    res.status(500).json({ error: "Failed to save order. Please try again." });
  }
});

// GET /api/orders  — admin use only (add auth middleware in production)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

module.exports = router;
