// src/models/Recipe.js
const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
      },
    ],
    instructions: {
      type: String,
      required: true,
    },
    category: {
      type: String, // vd: món chính, món phụ, tráng miệng
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    user: { // Người dùng có thể tạo công thức của riêng họ
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;