import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ addBookmark, onSearch }) => {
  const [menuItems, setMenuItems] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null); // Track open dropdowns
  const [spicy, setSpicy] = useState(''); // Manage spicy filter state
  const [price, setPrice] = useState(''); // Manage price filter state
  const navigate = useNavigate();  // For programmatic navigation

  useEffect(() => {
    const fetchNavBarContent = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/dishes');

        if (response.status === 200) {
          setMenuItems(response.data);  // Set the API data to state
        } else {
          alert('Failed to load dishes');
        }
      } catch (error) {
        console.error("There was an error!", error);
        alert('Failed to load dishes');
      }
    };

    fetchNavBarContent(); // Fetch data when component mounts
  }, []);  // Empty array to run this effect only once when the component mounts

  const handleDropdownToggle = (category) => {
    setOpenDropdown(openDropdown === category ? null : category); // Toggle dropdown open/close
  };

  const handleCategoryClick = (category, subcategory = null) => {
    // When a category is clicked, navigate to the corresponding page.
    if (subcategory) {
      navigate(`/${category}/${subcategory}`);  // Navigate to subcategory
    } else {
      navigate(`/${category}`);  // Navigate to category page
    }
  };

  // Function to handle search
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    let queryParams = '';
    if (spicy !== '') queryParams += `spicy=${spicy}&`;
    if (price) queryParams += `price${price}`; // price condition like price>30

    // Trigger the parent component's search function
    onSearch(queryParams); // This will send the query params to the parent component
  };

  const renderMenuItems = () => {
    return Object.entries(menuItems).map(([category, items]) => {
      if (category === 'soup') {
        // For "soup", we don't need a dropdown
        return (
          <li key={category} className="nav-item">
            <Link className="nav-link" to={`/${category}`} onClick={() => handleCategoryClick(category)}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          </li>
        );
      } else {
        // For categories with subcategories, show a dropdown
        return (
          <li key={category} className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href={`#${category}`}
              id={`navbarDropdown${category}`}
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded={openDropdown === category ? 'true' : 'false'} // Toggle 'expanded' state
              onClick={(e) => {
                e.preventDefault(); // Prevent default behavior for anchor tag
                handleDropdownToggle(category); // Toggle dropdown open/close
              }}
            >
              { category === 'bread-rice' ? 'Bread/Rice' : category.charAt(0).toUpperCase() + category.slice(1)}
            </a>
            <ul
              className={`dropdown-menu ${openDropdown === category ? 'show' : ''}`} // Add 'show' class when open
              aria-labelledby={`navbarDropdown${category}`}
            >
              {items.map((item, index) => (
                <li key={index}>
                  <a className="dropdown-item" href="#" onClick={() => handleCategoryClick(category, item)}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        );
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {renderMenuItems()} {/* Render dynamic menu items */}
          </ul>
        </div>

        <form className="d-flex gap-3 ms-3" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="form-control"
            placeholder="Price filter (e.g., price>30)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <select
            className="form-select"
            value={spicy}
            onChange={(e) => setSpicy(e.target.value)}
          >
            <option value="">Spicy?</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <button type="submit" className="btn btn-warning rounded-pill">Search</button>
        </form>
        
        <div className="d-flex gap-2">
          <button className="btn btn-outline-light rounded-pill">
            <i className="bi bi-arrow-left"></i>
          </button>
          <button className="btn btn-outline-light rounded-pill">
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>

        <div className="d-flex gap-3 ms-3">
          <button
            className="btn btn-warning rounded-pill"
            onClick={() => addBookmark('Sample Item')} // Example bookmark
          >
            <i className="bi bi-bookmark-plus"></i>
          </button>
          
          <button className="btn btn-info rounded-pill">
            <i className="bi bi-bookmarks"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
