import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Content = ({ searchQuery }) => {
  const { category, subcategory } = useParams();  // Get category and subcategory from URL
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let url = '';
        
        // Handle search route
        if (searchQuery && searchQuery.length > 0) {
          url = `http://localhost:8081/api/dishes/search?${searchQuery}`;
        } else if (category) {
          // Handle category/subcategory route
          url = `http://localhost:8081/api/dishes/${category}`;
          if (subcategory) {
            url += `/${subcategory}`;
          }
        }

        console.log("API URL:", url);  // Debugging: check the final URL

        const response = await axios.get(url);
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchItems();  // Fetch items whenever category, subcategory, or searchQuery changes
  }, [category, subcategory, searchQuery]);  // Re-run if category, subcategory, or searchQuery changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4 mb-4">
      <h3>Search Results</h3>

      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.name} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{item.name}</h5>
              <img src={`/images/${item.image}`} className="img-fluid rounded mx-auto d-block food-images" alt={item.name}></img>
              <p className="card-text">{item.description}</p>
              <p className="card-text"><strong>Price:</strong> ${item.price}</p>
              <p className="card-text"><strong>Spicy:</strong> {item.spicy ? 'Yes' : 'No'}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No items found based on your filters.</p>
      )}
    </div>
  );
};

export default Content;
