const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(`[Auth] Registration attempt received for email: ${email ? email.trim().toLowerCase() : 'none'}`);

    if (!name || !email || !password) {
      console.warn('[Auth] Registration rejected: Missing required fields');
      res.status(400);
      throw new Error('Please add all fields');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn('[Auth] Registration rejected: Invalid email format');
      res.status(400);
      throw new Error('Invalid email format');
    }
    
    if (password.length < 6) {
      console.warn('[Auth] Registration rejected: Password too short');
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      console.warn(`[Auth] Registration rejected: User already exists (${normalizedEmail})`);
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({ name: name.trim(), email: normalizedEmail, password });
    if (user) {
      console.log(`[Auth] User created successfully. ID: ${user._id}, DB: ${user.db?.name || 'unknown'}`);
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error(`[Auth] Registration error: ${error.message}`);
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`[Auth] Login attempt for: ${normalizedEmail}`);
    const user = await User.findOne({ email: normalizedEmail });
    if (user && (await user.matchPassword(password))) {
      console.log(`[Auth] Login successful for: ${normalizedEmail}`);
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.warn(`[Auth] Login failed for: ${normalizedEmail} (invalid credentials)`);
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    console.error(`[Auth] Login error: ${error.message}`);
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe };
