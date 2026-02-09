const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Paths to the data files
const usersFilePath = path.join(__dirname, '../data/users.json');
const categoriesFilePath = path.join(__dirname, '../data/categories.json');
const dishesFilePath = path.join(__dirname, '../data/dishes.json');

// Helper functions to read and write data
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (error) {
    return [];  // Return an empty array if the file is not found
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to file:', error);
  }
};

// Get all categories
exports.getCategories = (req, res) => {
  const categories = readData(categoriesFilePath);
  if (categories) {
    const categoriesArray = Object.keys(categories).map(key => ({
      name: key,
      subcategories: categories[key]
    }));
    res.json(categoriesArray); // Send categories as an array
  } else {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};


// Get all dishes
exports.getDishes = (req, res) => {
  const dishes = readData(dishesFilePath);
  if (dishes) {
    res.json(dishes); // Send dishes to the frontend
  } else {
    res.status(500).json({ message: 'Error fetching dishes' });
  }
};

// Admin actions
exports.searchUserByName = (req, res) => {
  const { name } = req.query; // Query parameter 'name'
  const users = readData(usersFilePath);
  const filteredUsers = users.filter(user => user.username.toLowerCase().includes(name.toLowerCase()));
  res.json(filteredUsers);
};

exports.searchUserByEmail = (req, res) => {
  const { email } = req.query; // Query parameter 'email'
  const users = readData(usersFilePath);
  const filteredUsers = users.filter(user => user.email.toLowerCase().includes(email.toLowerCase()));
  res.json(filteredUsers);
};

exports.addCategory = (req, res) => {
  const { categoryName } = req.body;  // Category name from the request
  const categories = readData(categoriesFilePath);

  if (categories[categoryName]) {
    return res.status(400).json({ message: 'Category already exists' });
  }

  categories[categoryName] = [];  // Initialize with an empty array of subcategories
  writeData(categoriesFilePath, categories);

  res.status(201).json({ message: 'Category added successfully' });
};

exports.deleteCategory = (req, res) => {
  const categoryId = req.params.categoryName;  // Category ID (name of the category)
  const categories = readData(categoriesFilePath);
  
  if (!categories[categoryId]) {
    return res.status(404).json({ message: 'Category not found' });
  }

  delete categories[categoryId];  // Remove the category
  writeData(categoriesFilePath, categories);

  res.status(200).json({ message: 'Category deleted successfully' });
};

exports.addSubcategory = (req, res) => {
  const { categoryId, subcategoryName } = req.body;  // category and subcategory name from the request
  const categories = readData(categoriesFilePath);

  if (!categories[categoryId]) {
    return res.status(404).json({ message: 'Category not found' });
  }

  if (categories[categoryId].includes(subcategoryName)) {
    return res.status(400).json({ message: 'Subcategory already exists' });
  }

  categories[categoryId].push(subcategoryName);
  writeData(categoriesFilePath, categories);

  res.status(201).json({ message: 'Subcategory added successfully' });
};

exports.deleteSubcategory = (req, res) => {
  const { categoryName, subcategoryName } = req.params;  // Category and subcategory IDs from params
  const categories = readData(categoriesFilePath);
  
  console.log(categoryName);
  console.log(subcategoryName);
  if (!categories[categoryName]) {
    return res.status(404).json({ message: 'Category not found' });
  }

  const updatedSubcategories = categories[categoryName].filter(sub => sub !== subcategoryName);

  if (updatedSubcategories.length === categories[categoryName].length) {
    return res.status(404).json({ message: 'Subcategory not found' });
  }

  categories[categoryName] = updatedSubcategories;
  writeData(categoriesFilePath, categories);

  // Remove all dishes in the subcategory as well (clean-up operation)
  const dishes = readData(dishesFilePath);
  const updatedDishes = dishes.filter(dish => !(dish.category === categoryName && dish.subcategory === subcategoryName));
  writeData(dishesFilePath, updatedDishes);

  res.status(200).json({ message: 'Subcategory and its dishes removed successfully' });
};


exports.addDish = (req, res) => {
  const { category, subcategory, dish } = req.body;  // Dish info from the request body
  const dishes = readData(dishesFilePath);

  const newDish = { category, subcategory, ...dish };
  dishes.push(newDish);
  writeData(dishesFilePath, dishes);

  res.status(201).json({ message: 'Dish added successfully' });
};


exports.removeDish = (req, res) => {
  const dishId  = req.params.dishId;  // Dish ID to be removed
  const dishes = readData(dishesFilePath);

  const updatedDishes = dishes.filter(dish => dish.id !== dishId);  // Filter out the dish by ID
  writeData(dishesFilePath, updatedDishes);

  res.status(200).json({ message: 'Dish removed successfully' });
};


exports.editDish = (req, res) => {
  const dishId = req.params.dishId;  // Dish ID
  const { updatedDish } = req.body;  // New dish data
  const dishes = readData(dishesFilePath);

  const dishIndex = dishes.findIndex(dish => dish.id === dishId);

  if (dishIndex === -1) {
    return res.status(404).json({ message: 'Dish not found' });
  }

  dishes[dishIndex] = { ...dishes[dishIndex], ...updatedDish };
  writeData(dishesFilePath, dishes);

  res.status(200).json({ message: 'Dish updated successfully' });
};

exports.resetAdminPassword = async (req, res) => {
  const { username, newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const users = readData(usersFilePath);
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.password = hashedPassword; // Update the password
  writeData(usersFilePath, users);
  res.status(200).json({ message: 'Password reset successfully' });
};
