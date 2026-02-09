const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route to fetch all categories
router.get('/categories', adminController.getCategories);

// Route to fetch all dishes
router.get('/dishes', adminController.getDishes);

// Routes for admin actions
router.get('/searchUserByName', adminController.searchUserByName);
router.get('/searchUserByEmail', adminController.searchUserByEmail);

router.post('/addCategory', adminController.addCategory);
router.delete('/deleteCategory/:categoryName', adminController.deleteCategory);
router.post('/addSubcategory', adminController.addSubcategory);
router.delete('/deleteSubcategory/:categoryName/:subcategoryName', adminController.deleteSubcategory);
router.post('/addDish', adminController.addDish);
router.delete('/removeDish/:dishId', adminController.removeDish);
router.put('/editDish/:dishId', adminController.editDish);

router.put('/resetAdminPassword', adminController.resetAdminPassword);

module.exports = router;
