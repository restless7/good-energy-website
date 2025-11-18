# Good Energy Website - Deployment Guide 🚀

## Pre-deployment Checklist

### 1. Environment Setup
Before deploying, ensure all required environment variables are configured:

```bash
# Required Environment Variables
RESEND_API_KEY=re_your_actual_api_key_here
ADMIN_EMAIL=admin@goodenergy.com
DATABASE_URL=your_production_database_url

# Optional Environment Variables
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
```

### 2. Database Preparation
```bash
# Generate Prisma client
npx prisma generate

# Deploy database schema (for production databases)
npx prisma db push

# For new production databases, seed initial data if needed
npx prisma db seed
```

### 3. Build Verification
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Run production build
npm run build

# Verify build succeeded without errors
npm run start
```

### 4. Conference Funnel Configuration

#### Set Conference Date
Update the conference date in `app/join-conference/components/CountdownTimer.tsx`:

```typescript
// Update this line with your actual conference date
const conferenceDate = new Date('2024-03-15T10:00:00-05:00'); // Adjust date/time/timezone
```

#### Configure Seat Limits
The current configuration allows 15 seats. To modify:

1. Update the database constraint if needed
2. Update any hardcoded references in the components
3. Test with the new limits

## Platform-Specific Deployment

### Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI (if not already installed)
   npm i -g vercel
   
   # Deploy from project root
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all required environment variables
   - Ensure `DATABASE_URL` points to your production database

3. **Domain Configuration**
   - Add custom domain in Vercel dashboard
   - Configure DNS records with your domain provider
   - Update `NEXT_PUBLIC_SITE_URL` environment variable

### Netlify Deployment

1. **Build Settings**
   ```bash
   # Build command
   npm run build
   
   # Publish directory
   .next
   ```

2. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all required variables
   - Deploy with environment variables

### AWS/DigitalOcean/Custom VPS

1. **Server Setup**
   ```bash
   # Install Node.js 18+ and npm
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   npm install -g pm2
   ```

2. **Application Deployment**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd good-energy-website
   
   # Install dependencies and build
   npm install
   npm run build
   
   # Start with PM2
   pm2 start npm --name "good-energy" -- start
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration** (if using reverse proxy)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Database Deployment Options

### Option 1: PlanetScale (Recommended for Production)
```bash
# Install PlanetScale CLI
# Create database
pscale database create good-energy-prod

# Create production branch
pscale branch create good-energy-prod production

# Get connection string
pscale connect good-energy-prod production --port 3309

# Update DATABASE_URL in environment
DATABASE_URL="mysql://username:password@host:port/database"
```

### Option 2: Railway
```bash
# Create PostgreSQL database on Railway
# Copy connection string to DATABASE_URL environment variable
DATABASE_URL="postgresql://username:password@host:port/database"

# Update Prisma schema if switching from SQLite to PostgreSQL
# In prisma/schema.prisma, change:
# provider = "postgresql"
```

### Option 3: Supabase
```bash
# Create new project on Supabase
# Go to Project Settings → Database
# Copy connection string for Prisma
DATABASE_URL="postgresql://username:password@host:port/database"
```

## Post-Deployment Verification

### 1. Functionality Testing
```bash
# Test main pages load
curl -I https://yourdomain.com/
curl -I https://yourdomain.com/investment-simulator
curl -I https://yourdomain.com/join-conference

# Test API endpoints
curl -X GET https://yourdomain.com/api/conference/reserve
curl -X POST https://yourdomain.com/api/conference/reserve \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","country":"Colombia","mode":"virtual"}'
```

### 2. Email System Verification
- Submit a test reservation through the form
- Verify confirmation email is sent to user
- Verify admin notification email is received
- Check Resend dashboard for delivery status

### 3. Database Verification
```bash
# Connect to production database and verify schema
npx prisma studio
# Check that conference_reservations table exists
# Verify test reservation was created
```

### 4. Performance Testing
- Test page load speeds with tools like:
  - Google PageSpeed Insights
  - GTmetrix
  - WebPageTest
- Verify Core Web Vitals are within acceptable ranges

## Monitoring Setup

### 1. Error Tracking
Consider adding error tracking service:

```bash
# Install Sentry (example)
npm install @sentry/nextjs

# Configure in next.config.js
# Add SENTRY_DSN to environment variables
```

### 2. Analytics Setup
```javascript
// Add Google Analytics or similar
// Update _app.tsx with tracking code
// Configure conversion goals for funnel metrics
```

### 3. Uptime Monitoring
- Set up uptime monitoring (Pingdom, UptimeRobot, etc.)
- Monitor critical endpoints:
  - Homepage: `/`
  - Conference funnel: `/join-conference`
  - Seat availability API: `/api/conference/reserve`

### 4. Database Monitoring
- Monitor database connection pool usage
- Set up alerts for high query times
- Monitor storage usage (especially important for conference reservations)

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use secure methods to inject env vars in production
- Regularly rotate API keys

### 2. Database Security
- Use connection pooling for production databases
- Enable SSL connections for database
- Regular database backups
- Implement rate limiting on API routes

### 3. Input Validation
- All form inputs are validated both client and server-side
- SQL injection protection via Prisma
- XSS protection via React's built-in escaping

## Rollback Plan

### Quick Rollback
```bash
# If using Vercel, rollback via dashboard or CLI
vercel rollback [deployment-url]

# If using PM2, keep previous version available
pm2 start ecosystem.config.js --env previous
```

### Emergency Procedures
1. **Database Issues**: Have database backup/restore procedures ready
2. **Email Issues**: Disable email sending if Resend API is down
3. **High Traffic**: Implement rate limiting and caching strategies
4. **Form Failures**: Have manual registration backup process

## Maintenance Schedule

### Weekly Tasks
- [ ] Check error logs and resolve issues
- [ ] Monitor conversion rates and funnel performance
- [ ] Verify email delivery rates
- [ ] Update dependencies if needed

### Monthly Tasks
- [ ] Review and optimize database performance
- [ ] Analyze user feedback and conversion data
- [ ] Security updates and patches
- [ ] Backup verification and testing

### Conference Event Tasks
- [ ] 1 week before: Send reminder emails to registrants
- [ ] 1 day before: Final seat count verification
- [ ] Day of: Monitor for last-minute registrations
- [ ] After event: Archive data and prepare for next conference

## Support Contacts

### Technical Issues
- **Frontend/UI**: Review component documentation
- **API Issues**: Check API endpoint documentation
- **Database**: Review Prisma schema and queries
- **Email**: Check Resend dashboard and logs

### Emergency Contacts
- **Server Down**: Contact hosting provider support
- **Database Issues**: Database provider support
- **Email Problems**: Resend support
- **Domain Issues**: Domain registrar support

---

**Deployment completed successfully! 🎉**  
*Remember to update this guide as the system evolves*