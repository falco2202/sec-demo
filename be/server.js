const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your React app's address
  credentials: true // Allow cookies to be sent
}));
app.use(bodyParser.json());

// In-memory user database (for demo only)
const users = [
  { username: 'admin', password: 'password123' }
];

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Find user (NEVER do authentication like this in production)
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // Generate a simple token (use proper JWT in real applications)
    const token = `user_${username}_token_${Date.now()}`;
    
    // Set a non-HttpOnly cookie (VULNERABLE TO XSS)
    res.cookie('sessionToken', token, {
      maxAge: 3600000, // 1 hour
      // httpOnly: false, // Default is false, making it accessible to JavaScript
      path: '/'
    });
    
    res.cookie('user', username, {
      maxAge: 3600000,
      // httpOnly: false, // Default is false
      path: '/'
    });
    
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  res.clearCookie('sessionToken');
  res.clearCookie('user');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Protected endpoint example
app.get('/api/profile', (req, res) => {
  // In a real app, verify the token here
  const sessionToken = req.cookies.sessionToken;
  const username = req.cookies.user;
  
  if (sessionToken && username) {
    res.json({
      username,
      email: `${username}@example.com`,
      role: 'user'
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Simple endpoint to demonstrate XSS vulnerability
app.get('/api/search', (req, res) => {
  const query = req.query.q || '';
  
  // VULNERABLE: Directly reflecting user input without sanitization
  res.send(`
    <h2>Search Results for: ${query}</h2>
    <p>No results found.</p>
  `);
});

// Cookie stealing demonstration endpoint (for educational purposes only)
app.get('/log', (req, res) => {
  console.log('Received stolen cookies:', req.query);
  res.status(200).send('');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});