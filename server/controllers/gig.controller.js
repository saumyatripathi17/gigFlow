const Gig = require("../models/Gig");
const Bid = require("../models/Bid");

// Get all open gigs with optional search (no pagination)
exports.getAllGigs = async (req, res) => {
  try {
    const { search } = req.query;
    console.log(`🔍 [GIGS] Fetching gigs - search: "${search || 'none'}"`);

    let query = { status: "open" };

    if (search) {
      // Search by title or description
      query.$text = { $search: search };
      console.log(`🔎 [GIGS] Text search activated for: "${search}"`);
    }

    const gigs = await Gig.find(query)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    console.log(`✅ [GIGS] Found ${gigs.length} gigs`);

    res.json({ gigs });
  } catch (err) {
    console.error("❌ [GIGS] Error fetching gigs:", err.message);
    res.status(500).json({ message: "Failed to fetch gigs", error: err.message });
  }
};

// Get gigs posted by logged-in user (no pagination)
exports.getUserGigs = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📋 [GIGS] Fetching user's gigs - user: ${userId}`);

    const gigs = await Gig.find({ ownerId: userId })
      .populate("ownerId", "name email")
      .populate("selectedBidId")
      .sort({ createdAt: -1 });

    console.log(`✅ [GIGS] Found ${gigs.length} user gigs`);

    res.json({ gigs });
  } catch (err) {
    console.error("❌ [GIGS] Error fetching user gigs:", err.message);
    res.status(500).json({ message: "Failed to fetch your gigs", error: err.message });
  }
};

// Get single gig by ID
exports.getGigById = async (req, res) => {
  try {
    const { gigId } = req.params;
    console.log(`👁️  [GIGS] Fetching gig details - gig: ${gigId}`);

    const gig = await Gig.findById(gigId)
      .populate("ownerId", "name email")
      .populate({
        path: "selectedBidId",
        populate: { path: "freelancerId", select: "name email" }
      });

    if (!gig) {
      console.log(`❌ [GIGS] Gig not found: ${gigId}`);
      return res.status(404).json({ message: "Gig not found" });
    }

    console.log(`✅ [GIGS] Gig details retrieved: "${gig.title}"`);
    res.json(gig);
  } catch (err) {
    console.error("❌ [GIGS] Error fetching gig:", err.message);
    res.status(500).json({ message: "Failed to fetch gig", error: err.message });
  }
};

// Create a new gig
exports.createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    const userId = req.user.id;
    console.log(`✏️  [GIGS] Creating new gig - title: "${title}", budget: $${budget}`);

    // Validation
    if (!title || !description || !budget) {
      console.log("❌ [GIGS] Missing required fields");
      return res.status(400).json({ message: "Title, description, and budget are required" });
    }

    if (title.length < 5 || title.length > 100) {
      console.log("❌ [GIGS] Title invalid length");
      return res.status(400).json({ message: "Title must be between 5 and 100 characters" });
    }

    if (description.length < 20) {
      console.log("❌ [GIGS] Description too short");
      return res.status(400).json({ message: "Description must be at least 20 characters" });
    }

    if (budget <= 0) {
      console.log("❌ [GIGS] Invalid budget");
      return res.status(400).json({ message: "Budget must be greater than 0" });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: userId
    });
    console.log(`✅ [GIGS] Gig created - ID: ${gig._id}`);

    const populatedGig = await gig.populate("ownerId", "name email");

    res.status(201).json({
      message: "Gig created successfully",
      gig: populatedGig
    });
  } catch (err) {
    console.error("❌ [GIGS] Error creating gig:", err.message);
    res.status(500).json({ message: "Failed to create gig", error: err.message });
  }
};

// Update gig (only if status is still "open" and user is owner)
exports.updateGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const { title, description, budget } = req.body;
    const userId = req.user.id;
    console.log(`✏️  [GIGS] Updating gig - gig: ${gigId}`);

    const gig = await Gig.findById(gigId);

    if (!gig) {
      console.log(`❌ [GIGS] Gig not found: ${gigId}`);
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== userId) {
      console.log(`❌ [GIGS] Unauthorized update attempt`);
      return res.status(403).json({ message: "You can only edit your own gigs" });
    }

    if (gig.status !== "open") {
      console.log(`❌ [GIGS] Cannot update assigned gig`);
      return res.status(400).json({ message: "Cannot edit a gig that has been assigned" });
    }

    // Update fields if provided
    if (title) gig.title = title;
    if (description) gig.description = description;
    if (budget) gig.budget = budget;

    const updatedGig = await gig.save();
    await updatedGig.populate("ownerId", "name email");
    console.log(`✅ [GIGS] Gig updated successfully`);

    res.json({
      message: "Gig updated successfully",
      gig: updatedGig
    });
  } catch (err) {
    console.error("❌ [GIGS] Error updating gig:", err.message);
    res.status(500).json({ message: "Failed to update gig", error: err.message });
  }
};

// Delete gig (only if status is "open" and user is owner)
exports.deleteGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const userId = req.user.id;
    console.log(`🗑️  [GIGS] Deleting gig - gig: ${gigId}`);

    const gig = await Gig.findById(gigId);

    if (!gig) {
      console.log(`❌ [GIGS] Gig not found: ${gigId}`);
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== userId) {
      console.log(`❌ [GIGS] Unauthorized delete attempt`);
      return res.status(403).json({ message: "You can only delete your own gigs" });
    }

    if (gig.status !== "open") {
      console.log(`❌ [GIGS] Cannot delete assigned gig`);
      return res.status(400).json({ message: "Cannot delete a gig that has been assigned" });
    }

    // Delete all associated bids
    const bidCount = await Bid.countDocuments({ gigId });
    await Bid.deleteMany({ gigId });
    console.log(`✅ [GIGS] Deleted ${bidCount} associated bids`);

    await Gig.findByIdAndDelete(gigId);
    console.log(`✅ [GIGS] Gig deleted successfully`);

    res.json({ message: "Gig and its bids deleted successfully" });
  } catch (err) {
    console.error("❌ [GIGS] Error deleting gig:", err.message);
    res.status(500).json({ message: "Failed to delete gig", error: err.message });
  }
};
