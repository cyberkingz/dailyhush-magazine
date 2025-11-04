# 🚀 DailyHush TestFlight Deployment Checklist

Follow these steps in order to deploy Anna backend and build the iOS app for TestFlight.

## ✅ Pre-Deployment Checklist

- [ ] All E2E tests passing locally
- [ ] Backend running without errors on localhost
- [ ] Mobile app tested on iOS simulator
- [ ] Full Anna conversation flow tested (Talk → Exercise → Victory)

## 🔧 Step 1: Deploy Backend to Render (~10 minutes)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up and connect GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Select `dailyhush-blog` repository
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Add Environment Variables**
   Copy from `backend/.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-...
   OPENAI_API_KEY=sk-proj-...
   SUPABASE_URL=https://kisewkjogomsstgvqggc.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=...
   MOBILE_APP_URL=*
   NODE_ENV=production
   ```

4. **Deploy and Test**
   - Wait for build (~3-5 min)
   - Copy production URL (e.g., `https://dailyhush-anna-backend.onrender.com`)
   - Test: `curl https://[your-url]/health`

## 📱 Step 2: Update Mobile App (~5 minutes)

1. **Update .env file**
   ```bash
   cd dailyhush-mobile-app
   ```

   Edit `.env` and change:
   ```
   EXPO_PUBLIC_ANNA_BACKEND_URL=https://[your-render-url]
   ```

2. **Increment Build Number**
   Edit `app.json`:
   ```json
   "ios": {
     "buildNumber": "1.0.1"  // Update this
   }
   ```

## 🏗️ Step 3: Build with EAS (~30 minutes)

1. **Install EAS CLI** (if not installed)
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```
   Enter your Expo credentials (create account if needed)

3. **Configure EAS** (first time only)
   ```bash
   eas build:configure
   ```
   - Select iOS
   - Let EAS manage credentials

4. **Build for TestFlight**
   ```bash
   eas build --platform ios --profile preview
   ```

   This will:
   - Upload code to Expo servers
   - Generate iOS signing certificates
   - Build the .ipa file (~15-20 min)
   - Provide download link

5. **Monitor Build**
   - Watch progress at: https://expo.dev
   - Build logs will show in terminal
   - Wait for "Build finished" message

## ✈️ Step 4: Submit to TestFlight (~15 minutes)

### Option A: Automatic (Recommended)
```bash
eas submit --platform ios --latest
```

### Option B: Manual
1. Download .ipa from EAS build page
2. Go to https://appstoreconnect.apple.com
3. Select your app → TestFlight
4. Upload .ipa file

## 👥 Step 5: Add Testers

1. In App Store Connect → TestFlight
2. Click "Internal Testing" (up to 100 testers)
3. Create test group: "DailyHush Beta"
4. Add tester emails
5. Click "Add Build" → Select your build
6. Testers receive email invitation

## 🧪 Step 6: Test on Physical Device

1. Install TestFlight app on iPhone
2. Accept invitation email
3. Open TestFlight → Install DailyHush
4. Test full flow:
   - [ ] Login/signup works
   - [ ] Navigate to Anna
   - [ ] Start conversation
   - [ ] Trigger exercise (say intensity is 8+)
   - [ ] Complete exercise
   - [ ] See victory message
   - [ ] Check analytics in PostHog

## 🔍 Verification

After deployment, verify:

- [ ] Backend health check responds: `curl https://[your-url]/health`
- [ ] WebSocket connects from mobile app
- [ ] Anna responds to messages
- [ ] Exercise triggers correctly
- [ ] Victory message displays after exercise
- [ ] Analytics events logged (check PostHog)
- [ ] No crashes in TestFlight

## 📊 Monitoring

**Backend Logs**: https://dashboard.render.com
**Build History**: https://expo.dev
**TestFlight Crashes**: https://appstoreconnect.apple.com
**Analytics**: https://us.posthog.com

## 🐛 Common Issues

### Backend sleeping (Render free tier)
- First request may be slow (cold start)
- Consider upgrading to Starter plan ($7/month)

### Build fails: "Missing credentials"
```bash
eas credentials
```
Select iOS → Regenerate credentials

### TestFlight upload rejected
- Check bundle identifier matches Apple Developer account
- Ensure buildNumber is incremented
- Verify all Info.plist permissions present

### WebSocket won't connect
- Ensure EXPO_PUBLIC_ANNA_BACKEND_URL uses `https://`
- Check backend is running (not sleeping)
- Verify environment variables in .env

## 🎉 Success Criteria

You're ready for beta testing when:

- ✅ 20 testers can install via TestFlight
- ✅ Users can complete full Anna conversation flow
- ✅ Exercise triggers and victory messages work
- ✅ No crashes in first 3 sessions
- ✅ Analytics tracking all events

## 📝 Next Steps After TestFlight

1. Gather feedback from testers
2. Fix any critical bugs
3. Increment version: `1.0.0` → `1.0.1`
4. Re-build and re-submit
5. Repeat until ready for App Store submission

---

**Estimated Total Time**: 1-2 hours (mostly waiting for builds)

**Questions?** Check `backend/DEPLOYMENT.md` for detailed guide.
