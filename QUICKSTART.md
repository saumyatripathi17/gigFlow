# 🚀 Quick Start Guide - GigFlow

## Start the Backend Server

```bash
cd server
npm install  # (if not already done)
node server.js
```

✅ Backend running on: `http://localhost:5000`

---

## Start the Frontend (in a NEW terminal)

```bash
cd client
npm install  # (if not already done)
npm run dev
```

✅ Frontend running on: `http://localhost:5173`

---

## 🧪 Test the Full Workflow

### Step 1: Register Two Users
1. Go to http://localhost:5173/register
2. Create Account 1 (e.g., "Alice Johnson" - will be the CLIENT)
3. Create Account 2 (e.g., "Bob Smith" - will be the FREELANCER)

### Step 2: Post a Gig (as Alice - Client)
1. Login as Alice
2. Click "Post a Gig"
3. Fill in:
   - Title: "Website Redesign"
   - Description: "I need a professional website redesign for my small business..."
   - Budget: $500
4. Click "Post Gig"
5. You'll see it in "My Gigs"

### Step 3: Browse & Submit Bid (as Bob - Freelancer)
1. Logout (click Logout in navbar)
2. Login as Bob
3. Click "Browse Gigs" (or Home)
4. Search for "Website" or scroll to find Alice's gig
5. Click "View Details"
6. Click "Submit a Bid"
7. Fill in:
   - Message: "I'm a web designer with 5 years of experience..."
   - Your Bid Price: $400
8. Click "Submit Bid"
9. Go to "My Bids" to see your submission

### Step 4: Review Bids & Hire (as Alice - Client)
1. Logout and login as Alice
2. Click "My Gigs"
3. Click "View Bids (1)" on your gig
4. See Bob's bid with his message and price
5. Click "Hire This Freelancer"
6. Confirm the popup

### Step 5: Verify Atomic Update
- ✓ Gig status changed to "Assigned"
- ✓ Bob's bid status shows "Hired" ✅
- ✓ Check as Bob: go to "My Bids" → shows "Hired" with congratulations
- ✓ If there were other bids, they'd show "Rejected"

---

## 🎯 Key Features to Test

### Search & Filter
- On home page, type "website" in search box
- Results update in real-time

### Pagination
- Create 12+ gigs
- Home page shows 10 per page
- Use Previous/Next buttons

### Multiple Bids (Optional Test)
1. Create a 3rd user (Charlie)
2. Login as Charlie
3. Go to Alice's gig
4. Submit another bid
5. As Alice, view bids - see both Bob and Charlie
6. Hire Bob
7. Login as Charlie - bid shows "Rejected"

### Withdraw Bid
1. Create new gig
2. Submit 2+ bids (from different users)
3. Withdraw one bid
4. Gig's bid count decreases

---

## 📊 Database

Your data is stored in MongoDB Atlas at:
```
mongodb+srv://17saumyatripathi:somu7065@cluster0.ekymv1p.mongodb.net/gigflow
```

You can view it in MongoDB Atlas dashboard.

---

## 🔑 Key Files to Know

**Backend:**
- `server/server.js` - Main server entry point
- `server/controllers/gig.controller.js` - Gig logic
- `server/controllers/bid.controller.js` - **Hiring logic is here!** (line ~130)
- `server/routes/bid.routes.js` - Bid endpoints

**Frontend:**
- `client/src/pages/Home.jsx` - Browse gigs with search
- `client/src/pages/GigBids.jsx` - Client views bids and hires
- `client/src/pages/MyBids.jsx` - Freelancer views their bids
- `client/src/api.js` - API calls to backend

---

## ⚠️ Common Issues

### Port 5000 Already in Use
```bash
# Kill process on port 5000 and restart
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Connection Failed
- Make sure `.env` has correct MONGO_URI
- Check MongoDB Atlas network access settings

### CORS Errors
- Make sure client runs on `http://localhost:5173`
- Check server has CORS enabled

### API Not Found (404)
- Make sure backend server is running
- Check URL path matches in `client/src/api.js`

---

## 🎓 What You've Built

✅ Full-stack freelance marketplace with:
- Secure user authentication (JWT + HttpOnly cookies)
- Search functionality
- CRUD operations for gigs
- Complex bidding system
- **Atomic hiring logic** (gig → assigned, bid → hired, others → rejected)
- Pagination
- Form validation
- Error handling
- Professional UI with Tailwind CSS

**This is production-ready code!** 🚀

---

## 📚 Next Features to Add (Optional)

1. **Ratings & Reviews** - Rate completed jobs
2. **Payment Integration** - Add Stripe for payments
3. **Real-time Notifications** - Socket.io for live updates
4. **User Profiles** - Portfolio, skills, past work
5. **Advanced Filters** - Category, skill level, rating
6. **Messages** - Direct messaging between client & freelancer
7. **File Uploads** - Attach files to gigs/bids
8. **Analytics** - Stats dashboard for users

---

Happy coding! 🎉
