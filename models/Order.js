const mongoose = require("mongoose");

// Each item mirrors the frontend products array fields
const orderItemSchema = new mongoose.Schema({
  id:       { type: Number, required: true },
  name:     { type: String, required: true },
  category: { type: String, required: true }, // coffee | livestock | produce
  price:    { type: Number, required: true },
  unit:     { type: String, required: true },
  qty:      { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    customerName:  { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true, lowercase: true },
    customerPhone: { type: String, trim: true, default: "" },
    items:         { type: [orderItemSchema], required: true },
    total:         { type: Number, required: true },
    status: {
      type:    String,
      enum:    ["pending", "confirmed", "fulfilled", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
