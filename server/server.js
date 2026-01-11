const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const gigRoutes = require("./routes/gig.routes");
const bidRoutes = require("./routes/bid.routes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

app.get("/", (req, res) => {
  res.send("GigFlow API Running...");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("🚀 Starting GigFlow Server...");
    await connectDB();
    console.log("✅ Database Connected");
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log("📝 API Endpoints ready:");
      console.log("   - POST   /api/auth/register");
      console.log("   - POST   /api/auth/login");
      console.log("   - POST   /api/auth/logout");
      console.log("   - GET    /api/gigs (with search)");
      console.log("   - GET    /api/gigs/:id");
      console.log("   - POST   /api/gigs (create)");
      console.log("   - PATCH  /api/gigs/:id (update)");
      console.log("   - DELETE /api/gigs/:id");
      console.log("   - GET    /api/gigs/user/my-gigs");
      console.log("   - POST   /api/bids (submit)");
      console.log("   - GET    /api/bids/:gigId (gig owner only)");
      console.log("   - PATCH  /api/bids/:id/hire");
      console.log("   - DELETE /api/bids/:id (withdraw)");
      console.log("   - GET    /api/bids/user/my-bids");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
