const express = require('express');
const cors = require('cors');
const path = require('path');  // Import path to handle static files
const userRoutes = require('./routes/userRoutes');
const dishRoutes = require('./routes/dishRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from React's build folder
app.use(express.static(path.join(__dirname, 'client/public')));

// This route will handle all non-API routes and serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
