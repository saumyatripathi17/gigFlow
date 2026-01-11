const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  gigId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Gig",
    required: true
  },
  freelancerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  message: { 
    type: String, 
    required: true,
    minlength: 10,
    maxlength: 2000
  },
  bidPrice: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ["pending", "hired", "rejected"],
    default: "pending"
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

// Prevent duplicate bids from same freelancer on same gig
bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });
bidSchema.index({ gigId: 1 });
bidSchema.index({ freelancerId: 1 });
bidSchema.index({ status: 1 });

module.exports = mongoose.model("Bid", bidSchema);
