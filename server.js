require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");

const productRoutes = require("./routes/products");
const orderRoutes   = require("./routes/orders");
const commentRoutes = require("./routes/comments");

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.use("/api/products", productRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/comments", commentRoutes);

// Health check
app.get("/api/health", (_, res) =>
  res.json({ status: "ok", service: "Sisimwo Estate API" })
);

// ── Connect to MongoDB then start ─────────────────────────────
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🌿 Sisimwo API running → http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
