// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const shoppingListRoutes = require('./routes/shoppingListRoutes');
const foodItemRoutes = require('./routes/foodItemRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const familyGroupRoutes = require('./routes/familyGroupRoutes'); // <-- Dòng này đã được thêm

dotenv.config();
connectDB(); // Kết nối MongoDB

const app = express();

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:8080', // Đảm bảo rằng đây là địa chỉ frontend của bạn
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shoppinglists', shoppingListRoutes);
app.use('/api/fooditems', foodItemRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/mealplans', mealPlanRoutes);
app.use('/api/family-groups', familyGroupRoutes); // <-- Dòng này đã được thêm

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});