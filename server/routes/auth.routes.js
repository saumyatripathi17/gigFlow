const express = require("express");
const { register, login, logout } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected route example
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Protected route", userId: req.user.id });
});

module.exports = router;
