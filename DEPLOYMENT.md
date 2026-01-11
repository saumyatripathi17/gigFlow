# 🚀 Deployment Guide - GigFlow

Once your GigFlow application is complete and tested, here's how to deploy it to production.

---

## Backend Deployment (Node.js Server)

### Option 1: Deploy on Railway

**Steps:**
1. Create account at https://railway.app
2. Connect your GitHub repository
3. Click "New Project"
4. Select "Deploy from GitHub"
5. Choose your gigFlow repository
6. Railway auto-detects Node.js
7. Set environment variables:
   ```
   MONGO_URI=<your production MongoDB URI>
   JWT_SECRET=<generate a strong secret>
   NODE_ENV=production
   ```
8. Deploy! 🎉

Your backend will be available at: `https://your-app.railway.app`

---

### Option 2: Deploy on Heroku

**Steps:**
1. Create account at https://heroku.com
2. Install Heroku CLI
3. In `server` folder:
   ```bash
   heroku login
   heroku create your-gigflow-app
   git push heroku main
   heroku config:set MONGO_URI=<your_uri>
   heroku config:set JWT_SECRET=<your_secret>
   ```

Backend available at: `https://your-gigflow-app.herokuapp.com`

---

### Option 3: Deploy on AWS/Azure

Use EC2 (AWS) or Virtual Machines (Azure):
1. Create Linux instance
2. SSH into server
3. Install Node.js
4. Clone your repo
5. Install dependencies
6. Set environment variables
7. Use PM2 for process management
8. Setup reverse proxy (Nginx)
9. Configure SSL certificate

---

## Frontend Deployment (React App)

### Option 1: Deploy on Vercel (Recommended)

**Steps:**
1. Create account at https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select `client` folder as root
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```
6. Click "Deploy"

Your frontend available at: `https://your-app.vercel.app`

**Update API URL in frontend:**
```javascript
// client/src/api.js
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api'
```

---

### Option 2: Deploy on Netlify

**Steps:**
1. Create account at https://netlify.com
2. Connect GitHub
3. Select `client` folder
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables
7. Deploy!

Available at: `https://your-app.netlify.app`

---

### Option 3: Deploy on GitHub Pages

For static hosting (limited features):
1. Add to `client/vite.config.js`:
   ```javascript
   export default {
     base: '/gigflow/',
     // ...
   }
   ```
2. Add script to `package.json`:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```
3. Run: `npm run deploy`

---

## Database (MongoDB)

### Production Setup

Your current setup uses **MongoDB Atlas** (cloud).

**For production:**
1. Create production cluster in MongoDB Atlas
2. Create strong password for database user
3. Whitelist IP addresses
4. Enable encryption at rest
5. Enable backups
6. Update `MONGO_URI`:
   ```
   mongodb+srv://prod_user:strong_password@cluster.mongodb.net/gigflow_prod?retryWrites=true&w=majority
   ```

---

## Pre-Deployment Checklist

### Backend
- [ ] Remove all `console.log` statements
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (generate at https://random-keygen.com)
- [ ] Enable `secure: true` in cookies for HTTPS
- [ ] Update CORS origin to production domain
- [ ] Set error handlers to not expose sensitive info
- [ ] Add rate limiting on endpoints
- [ ] Setup logging service (e.g., LogRocket, Sentry)
- [ ] Test all endpoints in production
- [ ] Setup monitoring and alerts

### Frontend
- [ ] Build and test: `npm run build`
- [ ] Verify no hardcoded localhost URLs
- [ ] Update API base URL to production
- [ ] Optimize images
- [ ] Minimize bundle size
- [ ] Test on mobile devices
- [ ] Setup error tracking (e.g., Sentry)
- [ ] Add analytics (e.g., Google Analytics)
- [ ] Test all user flows

### Database
- [ ] Regular backups enabled
- [ ] Encryption at rest enabled
- [ ] Network access restricted
- [ ] Database user permissions limited
- [ ] Indexes optimized
- [ ] Connection pooling configured

---

## Environment Variables for Production

### Backend (.env)
```
NODE_ENV=production
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/gigflow?retryWrites=true&w=majority
JWT_SECRET=your_very_long_random_secret_key_here
PORT=5000

# Optional - for monitoring
SENTRY_DSN=https://your-sentry-key@sentry.io/project-id
LOG_LEVEL=info
```

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=GigFlow
```

---

## Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          # Deploy backend
          
      - name: Deploy Frontend
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          # Deploy frontend
```

---

## Security Hardening for Production

### Backend Security
1. **HTTPS Only** - Use SSL/TLS certificates
2. **CORS** - Restrict to frontend domain only:
   ```javascript
   app.use(cors({
     origin: "https://your-frontend-domain.com",
     credentials: true
   }))
   ```
3. **Rate Limiting** - Install `express-rate-limit`:
   ```bash
   npm install express-rate-limit
   ```
4. **Helmet.js** - Add security headers:
   ```bash
   npm install helmet
   app.use(helmet())
   ```
5. **Sanitization** - Prevent XSS attacks
6. **CSRF Protection** - If needed
7. **DDoS Protection** - Use Cloudflare

### Frontend Security
1. **Content Security Policy** - Restrict resource loading
2. **HTTPS Only** - Always use HTTPS
3. **Secure Headers** - Set Strict-Transport-Security
4. **No Secrets in Code** - Use environment variables
5. **Regular Updates** - Keep dependencies updated

---

## Monitoring & Logging

### Backend Monitoring
```bash
npm install pm2
pm2 start server.js --name "gigflow-api"
pm2 logs gigflow-api
pm2 save
pm2 startup
```

### Application Monitoring
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **DataDog** - Infrastructure monitoring
- **New Relic** - Performance monitoring

### Database Monitoring
- MongoDB Atlas dashboard
- Query performance analytics
- Index analysis
- Backup status

---

## Performance Optimization

### Backend
1. Add pagination (already done ✓)
2. Enable gzip compression:
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```
3. Add caching (Redis)
4. Optimize database queries
5. Use CDN for static assets

### Frontend
1. Lazy load components
2. Code splitting with React.lazy()
3. Optimize images (WebP format)
4. Minify CSS/JS
5. Enable service worker

### Database
1. Add more indexes if needed
2. Optimize slow queries
3. Archive old data
4. Connection pooling

---

## Cost Estimation

**Monthly costs (estimated):**

| Service | Free Tier | Paid |
|---------|-----------|------|
| Railway Backend | $5-10 | $10-50 |
| Vercel Frontend | Free | Free/$20 |
| MongoDB Atlas | 512MB | $10-100+ |
| Domain | - | $10-15 |
| **Total** | **~$15** | **$30-165** |

---

## Scaling Strategy

As your app grows:

1. **Phase 1 (0-1000 users)**
   - Single server
   - Single database
   - Basic monitoring

2. **Phase 2 (1000-10000 users)**
   - Load balancer
   - Database replicas
   - Redis caching
   - CDN for static assets

3. **Phase 3 (10000+ users)**
   - Microservices
   - Database sharding
   - Message queues (RabbitMQ)
   - Advanced caching strategies

---

## Rollback Strategy

If deployment fails:

```bash
# Backend (Railway)
# Simply redeploy previous commit

# Frontend (Vercel)
# Go to Deployments tab
# Click "Rollback" on previous version

# Database
# Use MongoDB Atlas backup restore
```

---

## Post-Deployment Testing

**Checklist:**
- [ ] Register a new user
- [ ] Login successfully
- [ ] Post a gig
- [ ] Search for gigs
- [ ] Submit a bid
- [ ] View bids
- [ ] Hire a freelancer
- [ ] Check all statuses updated
- [ ] Verify emails sent (if configured)
- [ ] Check error handling
- [ ] Monitor performance
- [ ] Check logs for errors

---

## Maintenance

### Weekly
- Check error logs
- Monitor database size
- Review performance metrics
- Update dependencies

### Monthly
- Security audit
- Backup verification
- Cost analysis
- User feedback review

### Quarterly
- Major feature release
- Security penetration test
- Database optimization
- Infrastructure review

---

## Common Issues & Solutions

### Backend won't connect to MongoDB
```
✗ Check MONGO_URI format
✗ Verify IP whitelisting in MongoDB Atlas
✗ Check database user credentials
✗ Test connection with MongoDB Compass
```

### CORS errors in production
```
✗ Update CORS origin to production domain
✗ Check frontend API URL
✗ Verify cookie settings
✗ Test with curl from backend server
```

### Slow queries
```
✗ Add database indexes
✗ Optimize MongoDB queries
✗ Enable query caching
✗ Use connection pooling
```

### High memory usage
```
✗ Enable Node.js clustering
✗ Increase container memory
✗ Profile with clinic.js
✗ Check for memory leaks
```

---

## Useful Commands

```bash
# View logs
heroku logs --tail
railway logs

# View environment variables
heroku config
railway variables

# Restart app
heroku restart
railway redeploy

# View app info
heroku apps:info
railway info

# Scale up
heroku dyno:type standard-1x
railway scale
```

---

## Support & Resources

- **Railway Docs** - https://railway.app/docs
- **Vercel Docs** - https://vercel.com/docs
- **MongoDB Docs** - https://docs.mongodb.com
- **Express Security** - https://expressjs.com/en/advanced/best-practice-security.html
- **React Deployment** - https://vitejs.dev/guide/static-deploy.html

---

## Final Checklist Before Going Live

- [ ] SSL/HTTPS configured
- [ ] Error tracking setup
- [ ] Performance monitoring active
- [ ] Database backups automated
- [ ] Environment variables secured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Logging system in place
- [ ] Alerts configured
- [ ] Rollback plan ready
- [ ] Load testing completed
- [ ] Security audit passed

---

**Congratulations! Your GigFlow app is now production-ready! 🚀**

For questions or issues during deployment, check the official docs for your chosen platform.
