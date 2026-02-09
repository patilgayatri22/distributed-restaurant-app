const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Path to your user data file
const usersFilePath = path.join(__dirname, '../data/users.json');

// Read users data from the file
const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
  } catch (error) {
    return [];  // Return an empty array if no data exists yet
  }
};

// Write users data to the file
const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing to file:', error);
  }
};

// Handle user registration
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const users = readUsers();

  // Check if the username or email already exists
  const existingUser = users.find(user => user.username === username || user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Username or email already exists' });
  }

  // Add new user to the list
  const newUser = { username, email, password: hashedPassword, is_admin: false };
  users.push(newUser);

  // Save the updated user data to the file
  writeUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
};

// Handle user login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();

  // Find user by username
  const user = users.find(user => user.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    // Generate a JWT token
    const token = jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token: token, // Send token back to client,
      is_admin: user.is_admin
    });
  } else {
    res.status(400).json({ message: 'Invalid username or password' });
  }
};
