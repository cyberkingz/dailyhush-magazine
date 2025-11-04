# DailyHush Development Guide

Quick reference for running the app in development mode.

## Running Locally

### Backend (Terminal 1)
```bash
cd backend
npm run dev
```

Backend runs on: `http://localhost:3000` (or `http://192.168.1.67:3000` on local network)

### Mobile App (Terminal 2)
```bash
cd dailyhush-mobile-app
npm start
```

Metro bundler runs on: `http://192.168.1.67:8081`

## Testing on Different Devices

### iOS Simulator (on your Mac)
- .env setting: `EXPO_PUBLIC_ANNA_BACKEND_URL=http://localhost:3000`
- Press `i` in Metro terminal to open iOS simulator
- Backend accessible at `localhost:3000`

### Physical iPhone (via Expo Go)
- .env setting: `EXPO_PUBLIC_ANNA_BACKEND_URL=http://192.168.1.67:3000`
- Open Expo Go app on iPhone
- Scan QR code from Metro terminal
- Backend accessible at your laptop's IP (currently `192.168.1.67:3000`)

**Important**: If your laptop's IP changes (after reconnecting to WiFi):
1. Check new IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. Update `.env`: `EXPO_PUBLIC_ANNA_BACKEND_URL=http://[new-ip]:3000`
3. Restart Metro bundler

### Physical iPhone (Development Build)
- Same as Expo Go, but with custom native code
- Useful for testing native features (Bluetooth, notifications)

## Common Development Issues

### "WebSocket error" on physical device
**Problem**: Mobile app can't connect to backend
**Solution**:
1. Check backend is running: `curl http://192.168.1.67:3000/health`
2. Verify IP in .env matches laptop's current IP
3. Both devices must be on same WiFi network
4. Restart Metro bundler after .env changes

### "Cannot read property of undefined"
**Problem**: Hot reload broke state
**Solution**: Press `r` in Metro terminal to full reload

### Backend changes not reflecting
**Problem**: TypeScript not recompiling
**Solution**: Stop backend (`Ctrl+C`) and restart `npm run dev`

### Environment variables not updating
**Problem**: Metro cached old .env values
**Solution**:
```bash
# Stop Metro (Ctrl+C), then:
npx expo start -c  # -c clears cache
```

## Environment Variables

### Development (.env)
```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://kisewkjogomsstgvqggc.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[your-key]

# Anna Backend - Change based on testing device:
# For iOS Simulator:
EXPO_PUBLIC_ANNA_BACKEND_URL=http://localhost:3000
# For Physical iPhone:
EXPO_PUBLIC_ANNA_BACKEND_URL=http://192.168.1.67:3000

# Analytics
EXPO_PUBLIC_POSTHOG_API_KEY=phc_FH6zOGLX7Zv3rIL3e4aMvQmmizQ8Ugi1kKbENgkoq6S
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# RevenueCat (Test Keys)
EXPO_PUBLIC_REVENUECAT_IOS_KEY=test_KwZxiLPuioAGRBeGrmnYhpsOzug
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=test_KwZxiLPuioAGRBeGrmnYhpsOzug
```

### Backend (.env)
```bash
# AI APIs
ANTHROPIC_API_KEY=sk-ant-api03-[your-key]
OPENAI_API_KEY=sk-proj-[your-key]

# Supabase
SUPABASE_URL=https://kisewkjogomsstgvqggc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# CORS
MOBILE_APP_URL=*  # Allows all origins in development
```

## Testing Anna Conversation Flow

1. **Start backend** (`npm run dev` in backend folder)
2. **Start mobile app** (`npm start` in mobile app folder)
3. **Open on device/simulator**
4. **Navigate to Anna** (tap choice → "Talk to Anna")
5. **Test conversation**:
   - Type: "I'm worried about my presentation tomorrow"
   - Anna should respond and ask for intensity
   - Type: "8"
   - Anna should trigger exercise
   - Complete exercise
   - Return to Anna
   - Anna should show victory message

## Debugging

### View backend logs
```bash
# In backend terminal, you'll see:
[AnnaAgent] User message: "..."
[AnnaAgent] Stream started...
[AnnaAgent] Text delta: "..."
[Server] Tool called: triggerExercise
```

### View mobile app logs
```bash
# In Expo terminal, you'll see:
[useAnnaChat] Connected to Anna
[useAnnaChat] Sending message: "..."
[AnnaConversation] Exercise triggered: {...}
[Analytics] ANNA_MESSAGE_SENT
```

### Clear all caches
```bash
# Mobile app
npx expo start -c
rm -rf node_modules/.cache

# Backend
rm -rf dist
npm run build
```

## Hot Reload Tips

- **Mobile UI changes**: Hot reloads automatically
- **Backend changes**: Auto-reloads with `tsx watch`
- **Environment changes**: Requires full restart
- **Navigation changes**: Press `r` to reload
- **State got weird**: Press `r` to full reload

## Network Debugging

### Check laptop's IP address
```bash
# macOS
ifconfig | grep "inet " | grep -v 127.0.0.1

# You should see something like:
# inet 192.168.1.67 netmask 0xffffff00 broadcast 192.168.1.255
```

### Test backend from iPhone
1. Open Safari on iPhone
2. Navigate to: `http://192.168.1.67:3000/health`
3. Should see: `{"status":"ok",...}`

### Test WebSocket from iPhone
Use a WebSocket test app (search "WebSocket Test" in App Store) to connect to:
```
ws://192.168.1.67:3000
```

## Quick Commands

```bash
# Find your laptop's IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Health check backend
curl http://192.168.1.67:3000/health

# Full restart everything
cd backend && npm run dev &
cd dailyhush-mobile-app && npx expo start -c

# Clear node_modules (if things are really broken)
rm -rf node_modules package-lock.json
npm install
```

## Switching Between Simulator and Physical Device

When testing on **iOS Simulator** → Use `localhost:3000`
```bash
# .env
EXPO_PUBLIC_ANNA_BACKEND_URL=http://localhost:3000
```

When testing on **Physical iPhone** → Use laptop IP
```bash
# .env
EXPO_PUBLIC_ANNA_BACKEND_URL=http://192.168.1.67:3000
```

**Pro tip**: Create `.env.simulator` and `.env.device` files and swap them:
```bash
# Switch to simulator testing
cp .env.simulator .env

# Switch to device testing
cp .env.device .env
```

---

Need help? Check logs in both terminals for errors.
