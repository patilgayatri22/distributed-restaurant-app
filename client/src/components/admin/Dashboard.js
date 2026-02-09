import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [dishDetails, setDishDetails] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    subcategory: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subcategoryInputs, setSubcategoryInputs] = useState({});  // Tracks subcategory input for each category
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [editDishModal, setEditDishModal] = useState(false);
  const [selectedDishId, setSelectedDishId] = useState(null);

  // Fetch categories and dishes on component load
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8081/api/admin/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDishes = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8081/api/admin/dishes');
        setDishes(response.data);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchDishes();
  }, []);

  const handleAddCategory = async () => {
    try {
      const response = await axios.post('http://localhost:8081/api/admin/addCategory', { categoryName });
      setCategories([...categories, { name: categoryName, subcategories: [] }]);
      setCategoryName('');
      alert(response.data.message);
    } catch (error) {
      alert('Failed to add category');
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      const response = await axios.delete(`http://localhost:8081/api/admin/deleteCategory/${category}`);
      setCategories(categories.filter(c => c.name !== category));
      alert(response.data.message);
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  // Fixing Add Subcategory
  const handleAddSubcategory = async (categoryName) => {
    const subcategory = subcategoryInputs[categoryName];  // Get the value from subcategoryInputs
  
    console.log(categoryName, subcategory);
    
    if (!subcategory || !categoryName) return; // Ensure both values are present
  
    try {
      // Sending request to backend with both category and subcategory
      const response = await axios.post('http://localhost:8081/api/admin/addSubcategory', {
        categoryId: categoryName, // Use category name here
        subcategoryName: subcategory, // Use the value from the input state
      });
  
      // Update the categories with the newly added subcategory
      const updatedCategories = categories.map(category =>
        category.name === categoryName
          ? { ...category, subcategories: [...category.subcategories, subcategory] }
          : category
      );
      setCategories(updatedCategories);
      setSubcategoryInputs({ ...subcategoryInputs, [categoryName]: '' });  // Clear the specific input for this category
  
      alert(response.data.message);
    } catch (error) {
      alert('Failed to add subcategory');
    }
  };
  

  // Fixing Delete Subcategory
  const handleDeleteSubcategory = async (categoryName, subcategory) => {
    try {
      const response = await axios.delete(`http://localhost:8081/api/admin/deleteSubcategory/${categoryName}/${subcategory}`);
      const updatedCategories = categories.map(c =>
        c.name === categoryName
          ? { ...c, subcategories: c.subcategories.filter(s => s !== subcategory) }
          : c
      );
      setCategories(updatedCategories);
      alert(response.data.message);
    } catch (error) {
      alert('Failed to delete subcategory');
    }
  };

  const handleAddDish = async () => {
    try {
      const response = await axios.post('http://localhost:8081/api/admin/addDish', { dish: dishDetails });
      setDishes([...dishes, dishDetails]);
      setDishDetails({ name: '', price: '', description: '', category: '', subcategory: '' });
      alert(response.data.message);
    } catch (error) {
      alert('Failed to add dish');
    }
  };

  const handleRemoveDish = async (dishId) => {
    try {
      const response = await axios.delete(`http://localhost:8081/api/admin/removeDish/${dishId}`);
      setDishes(dishes.filter(dish => dish.id !== dishId));
      alert(response.data.message);
    } catch (error) {
      alert('Failed to remove dish');
    }
  };

  const handleSearchByName = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/admin/searchUserByName?name=${searchName}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching by name:', error);
    }
  };

  const handleSearchByEmail = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/admin/searchUserByEmail?email=${searchEmail}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching by email:', error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.put('http://localhost:8081/api/admin/resetAdminPassword', {
        username,
        newPassword
      });
      alert(response.data.message);
    } catch (error) {
      alert('Failed to reset password');
    }
  };

  const handleEditDish = (dishId) => {
    const dishToEdit = dishes.find(dish => dish.id === dishId);
    if (dishToEdit) {
      setDishDetails({
        name: dishToEdit.name,
        price: dishToEdit.price,
        description: dishToEdit.description,
        category: dishToEdit.category,
        subcategory: dishToEdit.subcategory,
      });
      
      setSelectedDishId(dishId); // Ensure this is properly set
      setEditDishModal(true); // Show modal
    }
  };

  // Handle update dish
  const handleUpdateDish = async () => {
    if (!selectedDishId) {
      alert('Dish ID is missing!');
      return;
    }
    // Create the updated dish object
    const updatedDish = { ...dishDetails, id: selectedDishId };
  
    try {
      const response = await axios.put(`http://localhost:8081/api/admin/editDish/${selectedDishId}`, { updatedDish });
      // Update the dishes state with the modified dish
      setDishes(dishes.map(dish => (dish.id === selectedDishId ? updatedDish : dish)));
      // Clear the form and close the modal
      setDishDetails({ name: '', price: '', description: '', category: '', subcategory: '' });
      setEditDishModal(false); // Close modal
      alert(response.data.message);
    } catch (error) {
      alert('Failed to update dish');
    }
  };
  

  const handleCloseModal = () => {
    setEditDishModal(false);  // Close modal
    setDishDetails({ name: '', price: '', description: '', category: '', subcategory: '' });
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>

      <div className="mt-4">
        <h3>Search Users</h3>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleSearchByName}>Search by Name</button>
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleSearchByEmail}>Search by Email</button>
        </div>
        <div>
          {searchResults.length > 0 ? (
            <ul className="list-group mt-3">
              {searchResults.map(user => (
                <li key={user.id} className="list-group-item">
                  {user.username} - {user.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>

      {/* Reset Admin Password */}
      <div className="mt-4">
        <h3>Reset Admin Password</h3>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-warning" onClick={handleResetPassword}>Reset Password</button>
      </div>

      {/* Add Category Section */}
      <div className="mb-3">
        <h3>Add New Category</h3>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAddCategory}>Add Category</button>
        </div>
      </div>

      {/* Category Management */}
      <div>
        <h3>Manage Categories</h3>
        {categories.length === 0 ? (
          <p>No categories available.</p>
        ) : (
          categories.map((category) => (
            <div key={category.name} className="card mb-3">
              <div className="card-header d-flex justify-content-between">
                <h5>{category.name}</h5>
                <button className="btn btn-danger" onClick={() => handleDeleteCategory(category.name)}>Delete</button>
              </div>
              <div className="card-body">
                {/* Add Subcategory */}
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Subcategory Name"
                    value={subcategoryInputs[category.name] || ''}  // Bind to specific category input state
                    onChange={(e) => setSubcategoryInputs({ ...subcategoryInputs, [category.name]: e.target.value })}
                  />
                  <button className="btn btn-success" onClick={() => handleAddSubcategory(category.name)}>Add Subcategory</button>
                </div>

                {/* List Subcategories */}
                <ul className="list-group">
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory} className="list-group-item d-flex justify-content-between">
                      <span>{subcategory}</span>
                      <button className="btn btn-danger" onClick={() => handleDeleteSubcategory(category.name, subcategory)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Dish Section */}
      <div className="mt-5">
        <h3>Add Dish</h3>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Dish Name"
            value={dishDetails.name}
            onChange={(e) => setDishDetails({ ...dishDetails, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            value={dishDetails.price}
            onChange={(e) => setDishDetails({ ...dishDetails, price: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            value={dishDetails.description}
            onChange={(e) => setDishDetails({ ...dishDetails, description: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <select
            className="form-control"
            value={dishDetails.category}
            onChange={(e) => {
              const selectedCategory = e.target.value;
              setDishDetails({ ...dishDetails, category: selectedCategory });
              setSelectedCategory(selectedCategory);
            }}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <select
            className="form-control"
            value={dishDetails.subcategory}
            onChange={(e) => setDishDetails({ ...dishDetails, subcategory: e.target.value })}
          >
            <option value="">Select Subcategory</option>
            {selectedCategory &&
              categories
                .find((category) => category.name === selectedCategory)
                ?.subcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleAddDish}>Add Dish</button>
      </div>

      {/* Edit Dish Modal */}
      {editDishModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="editDishModal" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Dish</h5>
                <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Dish Name"
                    value={dishDetails.name}
                    onChange={(e) => setDishDetails({ ...dishDetails, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    value={dishDetails.price}
                    onChange={(e) => setDishDetails({ ...dishDetails, price: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Description"
                    value={dishDetails.description}
                    onChange={(e) => setDishDetails({ ...dishDetails, description: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <select
                    className="form-control"
                    value={dishDetails.category}
                    onChange={(e) => {
                      const selectedCategory = e.target.value;
                      setDishDetails({ ...dishDetails, category: selectedCategory });
                      setSelectedCategory(selectedCategory);
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.name} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <select
                    className="form-control"
                    value={dishDetails.subcategory}
                    onChange={(e) => setDishDetails({ ...dishDetails, subcategory: e.target.value })}
                  >
                    <option value="">Select Subcategory</option>
                    {selectedCategory &&
                      categories
                        .find((category) => category.name === selectedCategory)
                        ?.subcategories.map((subcategory) => (
                          <option key={subcategory} value={subcategory}>
                            {subcategory}
                          </option>
                        ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateDish}>Update Dish</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Dishes */}
      <div className="mt-5">
        <h3>Manage Dishes</h3>
        {dishes.length === 0 ? (
          <p>No dishes available.</p>
        ) : (
          dishes.map((dish) => (
            <div key={dish.id} className="card mb-3">
              <div className="card-body d-flex justify-content-between">
                <span>{dish.name}</span>
                <div>
                  <button className="btn btn-warning" onClick={() => handleEditDish(dish.id)}>Edit</button>
                  <button className="btn btn-danger ml-2" onClick={() => handleRemoveDish(dish.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
