const express = require("express");
const {
  submitBid,
  getBidsForGig,
  getUserBids,
  hireBid,
  withdrawBid
} = require("../controllers/bid.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All bid routes require authentication
router.post("/", authMiddleware, submitBid);
router.get("/user/my-bids", authMiddleware, getUserBids);
router.get("/:gigId", authMiddleware, getBidsForGig);
router.patch("/:bidId/hire", authMiddleware, hireBid);
router.delete("/:bidId", authMiddleware, withdrawBid);

module.exports = router;
