const express = require('express');
const router = express.Router();
const { getCategories, getSubcategories, getDishesBySubcategory, searchDishes } = require('../controllers/dishController');

router.get('/search', searchDishes); // Search for spicy or price-based dishes
router.get('/', getCategories); // Get all categories
router.get('/:category', getSubcategories); // Get subcategories for a category
router.get('/:category/:subcategory', getDishesBySubcategory); // Get dishes in a subcategory

module.exports = router;
