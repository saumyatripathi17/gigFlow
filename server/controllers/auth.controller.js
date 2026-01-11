const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate email format
const isValidEmail = (email) => emailRegex.test(email);

// Validate password strength (minimum 6 characters)
const isValidPassword = (password) => password && password.length >= 6;

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`📝 [REGISTER] New registration attempt: ${email}`);

    // Input validation
    if (!name || !email || !password) {
      console.log("❌ [REGISTER] Missing required fields");
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (!isValidEmail(email)) {
      console.log(`❌ [REGISTER] Invalid email format: ${email}`);
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPassword(password)) {
      console.log("❌ [REGISTER] Password too weak (min 6 chars)");
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`❌ [REGISTER] Email already exists: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    console.log(`✅ [REGISTER] User created successfully: ${user._id} (${name})`);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ [REGISTER] Error:", err.message);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`🔐 [LOGIN] Login attempt: ${email}`);

    // Input validation
    if (!email || !password) {
      console.log("❌ [LOGIN] Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ [LOGIN] User not found: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`❌ [LOGIN] Invalid password for: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log(`✅ [LOGIN] JWT token generated for: ${user.name} (${user._id})`);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
console.log(`🚪 [LOGOUT] User logged out`);
  
    console.log(`✅ [LOGIN] Login successful: ${user.name}`);
    res.json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("❌ [LOGIN] Error:", err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};

