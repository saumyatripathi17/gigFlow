const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: true,
    minlength: 20,
    maxlength: 5000
  },
  budget: { 
    type: Number, 
    required: true,
    min: 1
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["open", "assigned"],
    default: "open"
  },
  selectedBidId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bid",
    default: null
  },
  bidCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for better search performance
gigSchema.index({ title: "text", description: "text" });
gigSchema.index({ ownerId: 1 });
gigSchema.index({ status: 1 });

module.exports = mongoose.model("Gig", gigSchema);
