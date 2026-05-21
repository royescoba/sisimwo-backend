const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true }, // matches frontend field name
    date: { type: String },                              // e.g. "May 2025" — kept as string to match frontend
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
