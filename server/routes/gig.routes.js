const express = require("express");
const {
  getAllGigs,
  getUserGigs,
  getGigById,
  createGig,
  updateGig,
  deleteGig
} = require("../controllers/gig.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllGigs);
router.get("/:gigId", getGigById);

// Protected routes (require authentication)
router.post("/", authMiddleware, createGig);
router.get("/user/my-gigs", authMiddleware, getUserGigs);
router.patch("/:gigId", authMiddleware, updateGig);
router.delete("/:gigId", authMiddleware, deleteGig);

module.exports = router;
