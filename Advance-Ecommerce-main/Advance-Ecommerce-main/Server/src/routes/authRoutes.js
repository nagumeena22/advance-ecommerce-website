import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// In-memory users store (temporary, resets on server restart)
const users = [];

// JWT secret
const JWT_SECRET = 'your_jwt_secret_key';

console.log('🔧 Auth routes loaded. Current users:', users.length);

// Test route to verify the router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!', userCount: users.length });
});

// ===========================
// @route   POST /api/register
// @desc    Register a user
// ===========================
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'User already exists' });
  }

  // Store user with more details
  const newUser = { 
    email, 
    password,
    firstName: email.split('@')[0], // Use email prefix as first name
    lastName: 'User',
    phone: '+1234567890',
    street: '',
    city: '',
    state: '',
    defaultAdd: false,
    addressess: []
  };
  
  users.push(newUser);

  console.log('✅ User registered:', email);
  console.log('📊 Total users:', users.length);

  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
  });
});

// ===========================
// @route   POST /api/login
// @desc    Login a registered user
// ===========================
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  console.log('🔍 Login attempt for:', email);
  
  const user = users.find(user => user.email === email && user.password === password);
  if (user) {
    console.log('✅ Login successful for:', email);
    const token = jwt.sign({ email: user.email, userId: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
    });
  }

  console.log('❌ Login failed for:', email);
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// ===========================
// @route   GET /api/profile
// @desc    Get user profile
// ===========================
router.get("/profile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.email === decoded.email);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    
    return res.status(200).json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// ===========================
// @route   PUT /api/profile
// @desc    Update user profile
// ===========================
router.put("/profile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userIndex = users.findIndex(u => u.email === decoded.email);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { firstName, lastName, phone, street, city, state } = req.body;
    
    // Update the user - only update the fields that were provided
    const updates = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (phone !== undefined) updates.phone = phone;
    if (street !== undefined) updates.street = street;
    if (city !== undefined) updates.city = city;
    if (state !== undefined) updates.state = state;
    
    users[userIndex] = { 
      ...users[userIndex], 
      ...updates
    };
    
    console.log('👤 Profile updated for user:', decoded.email);
    console.log('📝 New data:', { firstName, lastName, phone, street, city, state });
    
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// ===========================
// @route   POST /api/address
// @desc    Add user address
// ===========================
router.post("/address", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { firstName, lastName, country, company, street, city, state, phone, postal, instruction } = req.body;
    
    console.log('📍 Address added for user:', decoded.email);
    
    return res.status(201).json({
      success: true,
      message: 'Address added successfully'
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
