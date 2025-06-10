// src/routes/shoppingListRoutes.js
const express = require('express');
const {
  getShoppingLists,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
} = require('../controllers/shoppingListController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getShoppingLists).post(protect, createShoppingList);
router.route('/:id').put(protect, updateShoppingList).delete(protect, deleteShoppingList);

module.exports = router;