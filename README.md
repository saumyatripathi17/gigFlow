# 🚀 GigFlow - Freelance Marketplace Platform

A full-stack freelance marketplace where clients can post jobs (gigs) and freelancers can bid for them.

## 📋 Features

✅ **User Authentication**
- Secure sign-up and login with JWT
- HttpOnly cookies for security
- Role flexibility (any user can be client or freelancer)

✅ **Gig Management (CRUD)**
- Browse all open gigs with search/filter by title
- Post new gigs with title, description, and budget
- Edit gigs (only if open)
- Delete gigs (only if open, removes all bids)

✅ **Bidding System**
- Freelancers can submit bids with message and price
- Only pending bids can be withdrawn
- Prevents duplicate bids from same freelancer on same gig

✅ **Hiring Logic (The Core Feature)**
1. Client reviews all bids for their gig
2. Client clicks "Hire" button on a specific bid
3. **Atomic Updates Happen:**
   - ✓ Gig status changes from "open" to "assigned"
   - ✓ Selected bid status becomes "hired"
   - ✓ All other pending bids automatically marked as "rejected"

---

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- CORS enabled

**Frontend:**
- React 18 with Vite
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls

---

## 📁 Project Structure

```
gigFlow/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js    # Auth logic
│   │   ├── gig.controller.js     # Gig CRUD operations
│   │   └── bid.controller.js     # Bidding & hiring logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Gig.js                # Gig schema
│   │   └── Bid.js                # Bid schema
│   ├── routes/
│   │   ├── auth.routes.js        # /api/auth endpoints
│   │   ├── gig.routes.js         # /api/gigs endpoints
│   │   └── bid.routes.js         # /api/bids endpoints
│   ├── .env                       # Environment variables
│   ├── server.js                 # Entry point
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx        # Navigation component
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Browse gigs with search
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── PostGig.jsx       # Create gig form
│   │   │   ├── GigDetails.jsx    # Gig details & bidding
│   │   │   ├── MyGigs.jsx        # User's posted gigs
│   │   │   ├── MyBids.jsx        # User's submitted bids
│   │   │   └── GigBids.jsx       # View bids for gig & hire
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # React entry point
│   │   ├── index.css             # Global styles
│   │   ├── api.js                # API endpoints
│   │   ├── authSlice.js          # Redux auth slice
│   │   └── store.js              # Redux store setup
│   ├── index.html                # HTML template
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind configuration
│   ├── postcss.config.js         # PostCSS configuration
│   └── package.json
│
├── .gitignore                    # Git ignore file
└── README.md                     # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- Git

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment variables (.env):**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gigflow
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Start the server:**
   ```bash
   npm start
   # or
   node server.js
   ```
   ✅ Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   ✅ Client runs on `http://localhost:5173`

### Development (auto-reload)

- Frontend hot-reloads on file changes via Vite (HMR). Start the client dev server:
```bash
cd client
npm install
npm run dev
```

- Backend auto-restarts on file changes using `nodemon`. From the `server` folder install dev deps and run:
```bash
cd server
npm install
npm run dev
```

Now when you edit frontend files the browser updates automatically; when you edit backend files the server will restart and the client will reflect API changes after refresh.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |

### Gigs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gigs` | Get all open gigs (with search) |
| GET | `/api/gigs/:gigId` | Get gig details |
| POST | `/api/gigs` | Create new gig (protected) |
| GET | `/api/gigs/user/my-gigs` | Get user's gigs (protected) |
| PATCH | `/api/gigs/:gigId` | Update gig (protected) |
| DELETE | `/api/gigs/:gigId` | Delete gig (protected) |

### Bids
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bids` | Submit a bid (protected) |
| GET | `/api/bids/:gigId` | Get bids for gig (protected) |
| GET | `/api/bids/user/my-bids` | Get user's bids (protected) |
| PATCH | `/api/bids/:bidId/hire` | Hire freelancer - **Atomic update** (protected) |
| DELETE | `/api/bids/:bidId` | Withdraw bid (protected) |

---

## 🔐 Security Features

✅ **Password Hashing:** Bcrypt with 10 rounds  
✅ **JWT Authentication:** HttpOnly cookies for XSS protection  
✅ **Input Validation:** Server-side validation on all endpoints  
✅ **CORS:** Configured for localhost:5173  
✅ **Secure Cookies:** httpOnly, sameSite, secure (production)  
✅ **Database Indexes:** Optimized queries for search  

---

## 🎯 User Workflows

### As a Client (Job Poster)
1. Register & Login
2. Go to "Post a Gig"
3. Fill title, description, budget
4. Gig appears in marketplace
5. Go to "My Gigs" to see posted jobs
6. Click "View Bids" to see freelancers' proposals
7. Click "Hire This Freelancer" to select winner
   - Gig status → "assigned"
   - Selected bid → "hired"
   - Other bids → "rejected" (automatic)

### As a Freelancer
1. Register & Login
2. Browse gigs on home page (search by title)
3. Click on a gig to see details
4. Click "Submit a Bid" with:
   - Message (why you're perfect)
   - Your bid price
5. Go to "My Bids" to track submissions
6. If hired, status shows "Hired" ✓
7. If another won, status shows "Rejected" ✗

---

## 📊 Database Schema

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Gig
```javascript
{
  title: String,
  description: String,
  budget: Number,
  ownerId: ObjectId (ref: User),
  status: "open" | "assigned",
  selectedBidId: ObjectId (ref: Bid),
  bidCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Bid
```javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String,
  bidPrice: Number,
  status: "pending" | "hired" | "rejected",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing the Application

### 1. **Register & Login**
   - Go to http://localhost:5173/register
   - Create 2 accounts (client + freelancer)
   - Login with each

### 2. **Post a Gig (as client)**
   - Click "Post a Gig"
   - Fill form and submit
   - See it in "My Gigs"

### 3. **Browse & Search Gigs**
   - Go to home page
   - Search by title
   - See pagination

### 4. **Submit Bids (as freelancer)**
   - Click on a gig
   - Submit bid with message & price
   - See in "My Bids"

### 5. **Hire Freelancer (as client)**
   - Go to "My Gigs"
   - Click "View Bids"
   - See all bids from freelancers
   - Click "Hire This Freelancer"
   - Check gig status → "Assigned"
   - Check hired bid → "Hired"
   - Check other bids → "Rejected" (auto)

### 6. **Withdraw Bid (as freelancer)**
   - Go to "My Bids"
   - On pending bid, click "Withdraw Bid"
   - Bid is removed

---

## 🔧 Build & Deploy

### Build Frontend
```bash
cd client
npm run build
# Creates dist/ folder for production
```

### Production Notes
- Change `.env` MONGO_URI to production database
- Set `secure: true` in cookie options
- Update CORS origin to your domain
- Use environment variables for secrets

---

## 📝 Key Implementation Details

### Atomic Hiring Logic
When a client hires a freelancer:
```javascript
1. Find and verify bid
2. Verify client owns the gig
3. Update bid status → "hired"
4. Update gig status → "assigned"
5. Reject all other pending bids for that gig
```

This ensures consistency - one hire means one freelancer gets the job!

### Search Implementation
- Uses MongoDB text index on title & description
- Supports pagination (skip/limit)
- Returns matching gigs with bid count

### Authentication Flow
```
1. User registers/logins
2. Server validates & returns JWT
3. JWT stored in httpOnly cookie
4. Cookie sent with every request
5. Middleware verifies JWT before protected routes
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check MONGO_URI in .env
- Verify network access in MongoDB Atlas
- Ensure credentials are correct

### CORS Errors
- Make sure client runs on `http://localhost:5173`
- Server has CORS enabled for that origin

### Authentication Issues
- Clear browser cookies
- Check JWT_SECRET matches
- Verify token is in cookie

### Bids Not Showing
- Ensure gig status is "open"
- Check database has bids for that gig
- Verify user is gig owner

---

## 📚 Next Steps / Enhancements

1. **Add ratings/reviews** for freelancers
2. **Payment integration** (Stripe)
3. **File uploads** for gig attachments
4. **Real-time notifications** (Socket.io)
5. **User profiles** with portfolio
6. **Advanced filtering** (category, skill)
7. **Message system** between client & freelancer
8. **Admin panel** for moderation

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Support

For issues or questions, check the error messages in:
- Browser console (frontend)
- Terminal output (backend)
- MongoDB Atlas logs

---

**Happy coding! Build something amazing with GigFlow! 💪**
