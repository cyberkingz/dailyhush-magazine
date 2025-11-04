# Anna Backend Deployment Guide

This guide walks you through deploying the Anna backend to production and building the mobile app for TestFlight.

## Prerequisites

- [ ] GitHub account with this repo pushed
- [ ] Render account (https://render.com - free tier available)
- [ ] Apple Developer account ($99/year)
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Expo account (free - https://expo.dev)

## Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to https://render.com and sign up
2. Connect your GitHub account

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your `dailyhush-blog` repository
3. Configure the service:
   - **Name**: `dailyhush-anna-backend`
   - **Region**: Oregon (or closest to your users)
   - **Branch**: `main` (or your production branch)
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Starter for better performance)

### Step 3: Add Environment Variables
In Render dashboard → Environment tab, add:

```
NODE_ENV=production
ANTHROPIC_API_KEY=sk-ant-api03-[your-key]
OPENAI_API_KEY=sk-proj-[your-key]
SUPABASE_URL=https://[your-project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
MOBILE_APP_URL=*
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for build to complete (~3-5 minutes)
3. Note your production URL: `https://dailyhush-anna-backend.onrender.com`

### Step 5: Test Backend
```bash
# Health check
curl https://dailyhush-anna-backend.onrender.com/health

# Should return:
# {"status":"ok","service":"anna-backend","timestamp":"...","version":"1.0.0"}
```

## Part 2: Update Mobile App Configuration

### Step 1: Update Production Environment Variables
Edit `dailyhush-mobile-app/.env`:

```bash
# Change this line:
EXPO_PUBLIC_ANNA_BACKEND_URL=http://localhost:3000

# To your Render URL:
EXPO_PUBLIC_ANNA_BACKEND_URL=https://dailyhush-anna-backend.onrender.com
```

### Step 2: Update Build Number
Edit `dailyhush-mobile-app/app.json`:

```json
{
  "expo": {
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1.0.1"  // Increment for each new build
    }
  }
}
```

## Part 3: Build for TestFlight

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
cd dailyhush-mobile-app
eas login
```

### Step 3: Configure EAS Project
```bash
eas build:configure
```

This will:
- Link to your Expo project
- Generate credentials
- Create eas.json (already created)

### Step 4: Build for iOS
```bash
# For TestFlight (internal testing)
eas build --platform ios --profile preview

# Or for App Store submission
eas build --platform ios --profile production
```

This will:
1. Upload your code to Expo's build servers
2. Generate iOS signing certificates (if needed)
3. Build the .ipa file (~15-20 minutes)
4. Provide a download link when complete

### Step 5: Submit to TestFlight
After build completes:

**Option A: Automatic submission via EAS**
```bash
eas submit --platform ios --latest
```

**Option B: Manual submission**
1. Download the .ipa file from the EAS build page
2. Go to https://appstoreconnect.apple.com
3. Select your app → TestFlight tab
4. Click "+" to add a new build
5. Upload the .ipa file

### Step 6: Add Testers
1. In App Store Connect → TestFlight
2. Click "Internal Testing" or "External Testing"
3. Add tester emails
4. Testers will receive an email with TestFlight invitation

## Troubleshooting

### Backend won't start on Render
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure TypeScript compiled successfully (`npm run build`)

### EAS build fails
```bash
# Check build logs
eas build:list

# View specific build
eas build:view [build-id]
```

### TestFlight upload rejected
- Increment `buildNumber` in app.json
- Ensure bundle identifier matches Apple Developer account
- Check for missing Info.plist permissions

### WebSocket connection fails on device
- Ensure backend URL uses `https://` (not `http://`)
- Check Render service is running (not sleeping on free tier)
- Verify CORS settings allow mobile app origin

## Production Checklist

Before releasing to users:

- [ ] Backend deployed and health check passing
- [ ] Mobile app .env updated with production URL
- [ ] All environment variables secured (no hardcoded keys)
- [ ] Analytics configured (PostHog)
- [ ] Crash reporting enabled
- [ ] Push notifications tested
- [ ] Subscription flow tested (RevenueCat)
- [ ] Anna conversation tested on physical device
- [ ] Exercise flow tested end-to-end
- [ ] Victory message displays correctly

## Monitoring

### Backend Monitoring
- Render Dashboard: https://dashboard.render.com
- Check logs for errors
- Monitor WebSocket connections
- Track response times

### Mobile App Monitoring
- TestFlight Crash Reports
- PostHog Analytics Dashboard
- Supabase Auth Logs

## Updates

### To deploy backend updates:
```bash
git push origin main
# Render will auto-deploy
```

### To push mobile app update:
1. Increment `buildNumber` in app.json
2. Run `eas build --platform ios --profile production`
3. Submit to TestFlight
4. Notify testers of new build

---

## Quick Reference

**Backend URL**: https://dailyhush-anna-backend.onrender.com
**EAS Project**: dailyhush-mobile-app
**Bundle ID**: com.dailyhush.mobile
**Expo Dashboard**: https://expo.dev/accounts/[your-account]/projects/dailyhush

Need help? Check:
- Render Docs: https://render.com/docs
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- TestFlight Guide: https://developer.apple.com/testflight/
