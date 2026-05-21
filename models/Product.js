const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id:       { type: Number, required: true, unique: true }, // matches frontend id
  name:     { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ["coffee", "livestock", "produce"] },
  price:    { type: Number, required: true },
  unit:     { type: String, required: true },
  desc:     { type: String, required: true },
  img:      { type: String, required: true },
  inStock:  { type: Boolean, default: true },
});

module.exports = mongoose.model("Product", productSchema);
