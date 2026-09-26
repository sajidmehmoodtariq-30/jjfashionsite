const express = require('express');
const router = express.Router();
const { getCategories, addCategory, updateCategory, deleteCategory } = require('../controller/categoryController');
const authUser = require('../middleware/authUser');

// Fetch all categories (public/admin)
router.get('/fetchcategories', getCategories);

// Category Admin Routes
router.post('/addcategory', authUser, addCategory);
router.put('/updatecategory/:id', authUser, updateCategory);
router.delete('/deletecategory/:id', authUser, deleteCategory);

module.exports = router;
