const fs = require('fs');
const path = require('path');

const categoriesFilePath = path.join(__dirname, '../data/categories.json');
const dishesFilePath = path.join(__dirname, '../data/dishes.json');

// Fetch all categories from the static JSON file
exports.getCategories = (req, res) => {
  const categories = JSON.parse(fs.readFileSync(categoriesFilePath));
  res.json(categories);
};

// Fetch subcategories under a category from the static JSON file
exports.getSubcategories = (req, res) => {
  const { category } = req.params;
  const categories = JSON.parse(fs.readFileSync(categoriesFilePath));
  if (categories[category]) {
    res.json(categories[category]);
  } else {
    res.status(404).json({ message: "Category not found" });
  }
};

// Fetch all dishes under a specific subcategory from the static JSON file
exports.getDishesBySubcategory = (req, res) => {
  const { category, subcategory } = req.params;
  const dishes = JSON.parse(fs.readFileSync(dishesFilePath));
  const filteredDishes = dishes.filter(dish => dish.category === category && dish.subcategory === subcategory);
  res.json(filteredDishes);
};

// Search dishes by spice or price
exports.searchDishes = (req, res) => {
  console.log(req.query);
  
  // const { spicy, price } = req.query;
  let dishes = JSON.parse(fs.readFileSync(dishesFilePath));
  
  // if (spicy !== undefined) {
  //   const isSpicy = spicy.toLowerCase() === 'true';
  //   dishes = dishes.filter(dish => dish.spicy == isSpicy);
  // }
  
  // if (price) {
  //   // Match price filter with operator and number (e.g., ">=30", "<=20", etc.)
  //   const priceMatch = price.match(/(<=|>=|<|>|=)(\d+(\.\d+)?)/);  // Regex to match price operator and value
  //   if (priceMatch) {
  //     const operator = priceMatch[1];  // Extract the operator (e.g., <=, >=, <, >, =)
  //     const priceValue = parseFloat(priceMatch[2]);  // Extract the value and convert to a number
      
  //     // Apply the filtering logic based on the operator
  //     switch (operator) {
  //       case '<':
  //         dishes = dishes.filter(dish => dish.price < priceValue);
  //         break;
  //       case '<=':
  //         dishes = dishes.filter(dish => dish.price <= priceValue);
  //         break;
  //       case '>':
  //         dishes = dishes.filter(dish => dish.price > priceValue);
  //         break;
  //       case '>=':
  //         dishes = dishes.filter(dish => dish.price >= priceValue);
  //         break;
  //       case '=':
  //         dishes = dishes.filter(dish => dish.price === priceValue);
  //         break;
  //       default:
  //         return res.status(400).json({ error: "Invalid price filter operator." });
  //     }
  //   } else {
  //     // If the price query doesn't match the expected format
  //     return res.status(400).json({ error: "Invalid price filter format. Use <, <=, >, >=, or = followed by a number." });
  //   }
  // }

  Object.keys(req.query).forEach(key => {
    const value = req.query[key];

    // Handle spicy filter
    if (key === 'spicy') {
        if (value) {
            const isSpicy = value.toLowerCase() === 'true';
            dishes = dishes.filter(dish => dish.spicy === isSpicy);
        } else {
            return res.status(400).json({ error: "Invalid spicy filter format. Use =true or =false" });
        }
    }
    // Handle price filter
    if (key.includes('price')) {
        // Regex to capture price operator and value (e.g., price<30, price>=30, price>) 
        const match = key.match(/(<=|>=|<|>|=)/);
        if (match) {
            const operator = value ? match[1] + '=' : match[1];
            const priceValue = value || key.substring(match.index + match[0].length);

            // Apply the filtering logic based on the operator
            dishes = dishes.filter(dish => {
                switch (operator) {
                    case '<': return dish.price < parseFloat(priceValue);
                    case '<=': return dish.price <= parseFloat(priceValue);
                    case '>': return dish.price > parseFloat(priceValue);
                    case '>=': return dish.price >= parseFloat(priceValue);
                    case '=': return dish.price === parseFloat(priceValue);
                    default: return false;
                }
            });
        } else {
            if (value) {
                dishes = dishes.filter(dish => {
                    return dish.price === parseFloat(value);
                });
            } else {
                return res.status(400).json({ error: "Invalid price filter format. Use <, <=, >, >=, or = followed by a number." });

            }
        }
    }
});
  
  res.json(dishes);
};
