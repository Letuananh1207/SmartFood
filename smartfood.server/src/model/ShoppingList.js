// src/models/ShoppingList.js
const mongoose = require('mongoose');

const shoppingItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unit: { type: String }, // vd: kg, gram, cái, bó
  category: { type: String }, // vd: rau củ, thịt cá
  isPurchased: { type: Boolean, default: false },
});

const shoppingListSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['daily', 'weekly'],
      required: true,
    },
    items: [shoppingItemSchema],
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);
module.exports = ShoppingList;