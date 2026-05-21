const express = require("express");
const router  = express.Router();
const Comment = require("../models/Comment");
const { sendCommentNotification } = require("../utils/mailer");

// GET /api/comments — returns all comments newest-first
// Frontend calls this on load and merges with defaultComments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

// POST /api/comments
// Body: { name, text }  ← matches frontend field names exactly
router.post("/", async (req, res) => {
  const { name, text } = req.body;

  if (!name || !text) {
    return res.status(400).json({ error: "Name and comment text are required." });
  }

  // Build the same date string the frontend uses: "May 2025"
  const months = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
  const now  = new Date();
  const date = `${months[now.getMonth()]} ${now.getFullYear()}`;

  try {
    const comment = await Comment.create({ name, text, date });

    // Notify admin — fire and forget
    sendCommentNotification(comment).catch(err =>
      console.error("Comment email error:", err.message)
    );

    res.status(201).json(comment);
  } catch (err) {
    console.error("Comment save error:", err.message);
    res.status(500).json({ error: "Failed to save comment. Please try again." });
  }
});

module.exports = router;
