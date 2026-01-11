const Bid = require("../models/Bid");
const Gig = require("../models/Gig");
const User = require("../models/User");

// Submit a bid on a gig
exports.submitBid = async (req, res) => {
  try {
    const { gigId, message, bidPrice } = req.body;
    const freelancerId = req.user.id;
    console.log(`💰 [BIDS] Submitting bid - gig: ${gigId}, price: $${bidPrice}`);

    // Validation
    if (!gigId || !message || !bidPrice) {
      console.log("❌ [BIDS] Missing required fields");
      return res.status(400).json({ message: "gigId, message, and bidPrice are required" });
    }

    if (message.length < 10) {
      console.log("❌ [BIDS] Message too short");
      return res.status(400).json({ message: "Message must be at least 10 characters" });
    }

    if (bidPrice <= 0) {
      console.log("❌ [BIDS] Invalid bid price");
      return res.status(400).json({ message: "Bid price must be greater than 0" });
    }

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      console.log(`❌ [BIDS] Gig not found: ${gigId}`);
      return res.status(404).json({ message: "Gig not found" });
    }

    // Cannot bid on your own gig
    if (gig.ownerId.toString() === freelancerId) {
      console.log("❌ [BIDS] Freelancer tried to bid on own gig");
      return res.status(400).json({ message: "You cannot bid on your own gig" });
    }

    // Gig must be open
    if (gig.status !== "open") {
      console.log("❌ [BIDS] Gig is not open");
      return res.status(400).json({ message: "This gig is no longer open for bids" });
    }

    // Check if user has already bid on this gig
    const existingBid = await Bid.findOne({ gigId, freelancerId });
    if (existingBid) {
      console.log("❌ [BIDS] Freelancer already bid on this gig");
      return res.status(400).json({ message: "You have already submitted a bid for this gig" });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId,
      message,
      bidPrice
    });
    console.log(`✅ [BIDS] Bid submitted - ID: ${bid._id}, $${bidPrice}`);

    // Update bid count in gig
    await Gig.findByIdAndUpdate(gigId, { $inc: { bidCount: 1 } });
    console.log(`✅ [BIDS] Gig bid count updated`);

    const populatedBid = await Bid.findById(bid._id).populate("freelancerId", "name email").populate("gigId", "title");

    res.status(201).json({
      message: "Bid submitted successfully",
      bid: populatedBid
    });
  } catch (err) {
    console.error("❌ [BIDS] Error submitting bid:", err.message);
    
    // Handle unique constraint error
    if (err.code === 11000) {
      console.log("❌ [BIDS] Duplicate bid detected");
      return res.status(400).json({ message: "You have already bid on this gig" });
    }
    
    res.status(500).json({ message: "Failed to submit bid", error: err.message });
  }
};

// Get all bids for a specific gig (only gig owner can see)
exports.getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const userId = req.user.id;
    console.log(`👁️  [BIDS] Fetching bids for gig - gig: ${gigId}`);

    // Check if gig exists and user is the owner
    const gig = await Gig.findById(gigId);
    if (!gig) {
      console.log(`❌ [BIDS] Gig not found: ${gigId}`);
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== userId) {
      console.log("❌ [BIDS] Unauthorized access attempt");
      return res.status(403).json({ message: "You can only view bids for your own gigs" });
    }

    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    console.log(`✅ [BIDS] Found ${bids.length} bids for gig`);

    res.json({
      gig: {
        id: gig._id,
        title: gig.title,
        budget: gig.budget,
        status: gig.status
      },
      bidCount: bids.length,
      bids
    });
  } catch (err) {
    console.error("❌ [BIDS] Error fetching bids:", err.message);
    res.status(500).json({ message: "Failed to fetch bids", error: err.message });
  }
};

// Get bids submitted by logged-in user (freelancer perspective)
exports.getUserBids = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    console.log(`📋 [BIDS] Fetching user's bids`);

    const bids = await Bid.find({ freelancerId })
      .populate("gigId", "title budget status")
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    console.log(`✅ [BIDS] Found ${bids.length} user bids`);

    res.json({ bids });
  } catch (err) {
    console.error("❌ [BIDS] Error fetching user bids:", err.message);
    res.status(500).json({ message: "Failed to fetch your bids", error: err.message });
  }
};

// THE CRUCIAL HIRING LOGIC
// Client hires a freelancer on a specific bid
exports.hireBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const clientId = req.user.id;
    console.log(`🎯 [HIRING] ATOMIC TRANSACTION INITIATED - bid: ${bidId}`);

    // Find the bid
    const bid = await Bid.findById(bidId);
    if (!bid) {
      console.log(`❌ [HIRING] Bid not found: ${bidId}`);
      return res.status(404).json({ message: "Bid not found" });
    }
    console.log(`✅ [HIRING] Bid found - freelancer: ${bid.freelancerId}, price: $${bid.bidPrice}`);

    // Find the gig
    const gig = await Gig.findById(bid.gigId);
    if (!gig) {
      console.log(`❌ [HIRING] Gig not found: ${bid.gigId}`);
      return res.status(404).json({ message: "Gig not found" });
    }
    console.log(`✅ [HIRING] Gig found - title: "${gig.title}", status: ${gig.status}`);

    // Verify client owns the gig
    if (gig.ownerId.toString() !== clientId) {
      console.log("❌ [HIRING] Unauthorized - client does not own gig");
      return res.status(403).json({ message: "You can only hire for your own gigs" });
    }
    console.log(`✅ [HIRING] Authorization verified - client owns gig`);

    // Gig must still be open
    if (gig.status !== "open") {
      console.log(`❌ [HIRING] Gig not open - status: ${gig.status}`);
      return res.status(400).json({ message: "This gig is no longer open" });
    }

    // Bid must be pending
    if (bid.status !== "pending") {
      console.log(`❌ [HIRING] Bid not pending - status: ${bid.status}`);
      return res.status(400).json({ message: "This bid has already been processed" });
    }

    // ============ ATOMIC UPDATE PHASE ============
    console.log("⚙️  [HIRING] STEP 1: Updating bid status → HIRED");
    bid.status = "hired";
    await bid.save();
    console.log("✅ [HIRING] Bid status updated to HIRED");

    console.log("⚙️  [HIRING] STEP 2: Updating gig status → ASSIGNED");
    gig.status = "assigned";
    gig.selectedBidId = bidId;
    await gig.save();
    console.log("✅ [HIRING] Gig status updated to ASSIGNED");

    console.log("⚙️  [HIRING] STEP 3: Rejecting all other pending bids");
    const rejectedCount = await Bid.countDocuments({ gigId: bid.gigId, _id: { $ne: bidId }, status: "pending" });
    await Bid.updateMany(
      { gigId: bid.gigId, _id: { $ne: bidId }, status: "pending" },
      { status: "rejected" }
    );
    console.log(`✅ [HIRING] ${rejectedCount} other bids rejected`);

    // Populate for response
    const hiredBid = await Bid.findById(bidId).populate("freelancerId", "name email").populate("gigId", "title budget");
    console.log("🎉 [HIRING] ATOMIC TRANSACTION COMPLETED SUCCESSFULLY");

    res.json({
      message: "Freelancer hired successfully! All other bids have been rejected.",
      bid: hiredBid
    });
  } catch (err) {
    console.error("❌ [HIRING] ATOMIC TRANSACTION FAILED:", err.message);
    res.status(500).json({ message: "Failed to hire bid", error: err.message });
  }
};

// Cancel/Withdraw a bid (freelancer can only do this if status is pending)
exports.withdrawBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const freelancerId = req.user.id;
    console.log(`🚫 [BIDS] Withdrawing bid - bid: ${bidId}`);

    const bid = await Bid.findById(bidId);
    if (!bid) {
      console.log(`❌ [BIDS] Bid not found: ${bidId}`);
      return res.status(404).json({ message: "Bid not found" });
    }

    if (bid.freelancerId.toString() !== freelancerId) {
      console.log("❌ [BIDS] Unauthorized - freelancer does not own bid");
      return res.status(403).json({ message: "You can only withdraw your own bids" });
    }

    if (bid.status !== "pending") {
      console.log(`❌ [BIDS] Cannot withdraw - bid status: ${bid.status}`);
      return res.status(400).json({ message: "You can only withdraw pending bids" });
    }

    // Delete the bid
    await Bid.findByIdAndDelete(bidId);
    console.log(`✅ [BIDS] Bid deleted`);

    // Decrement bid count
    await Gig.findByIdAndUpdate(bid.gigId, { $inc: { bidCount: -1 } });
    console.log(`✅ [BIDS] Gig bid count decremented`);

    res.json({ message: "Bid withdrawn successfully" });
  } catch (err) {
    console.error("❌ [BIDS] Error withdrawing bid:", err.message);
    res.status(500).json({ message: "Failed to withdraw bid", error: err.message });
  }
};
