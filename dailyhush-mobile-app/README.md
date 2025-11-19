# Daily Hush Mobile App

A mobile companion app for the DailyHush Shift breathing necklace, designed specifically for women 65+ who experience chronic rumination. This app delivers real-time spiral interruption, F.I.R.E. Protocol training, pattern tracking, and physical product integration.

## 📱 Overview

**Target Users:** Women 65+ with chronic rumination
**Platform:** iOS (Phase 1), Android (Phase 2)
**Tech Stack:** React Native + Expo + TypeScript + Supabase + NativeWind

### Core Features (MVP)

1. **Spiral Interrupt** - 90-second emergency protocol
2. **F.I.R.E. Protocol Training** - 4-module clinical course
3. **Pattern Insights** - Dashboard tracking rumination patterns
4. **Shift Integration** - Bluetooth pairing with necklace
5. **3AM Mode** - Nighttime support interface

## 🚀 Getting Started

### Prerequisites

- Node.js 20.19.0+ (LTS)
- npm or yarn
- iOS Simulator (Xcode) or physical iOS device
- Expo Go app (for testing)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Project Structure

```
dailyhush-mobile-app/
├── app/                    # Expo Router file-based routing
│   ├── (tabs)/            # Tab navigation screens
│   ├── onboarding/        # Onboarding flow
│   ├── spiral/            # Spiral interrupt screens
│   ├── training/          # F.I.R.E. training modules
│   ├── insights/          # Pattern insights
│   ├── settings/          # App settings
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home screen
│
├── components/            # Reusable UI components
│   ├── Button.tsx         # Custom button component
│   ├── Card.tsx           # Card component
│   ├── Container.tsx      # Layout container
│   └── ...
│
├── constants/             # App constants
│   └── theme.ts           # Design system (colors, typography)
│
├── types/                 # TypeScript type definitions
│   └── index.ts           # All app types
│
├── utils/                 # Utility functions
│   └── supabase.ts        # Supabase client setup
│
├── store/                 # State management (Zustand)
│   └── useStore.ts        # Global app state
│
├── hooks/                 # Custom React hooks
│   ├── useSpiral.ts       # Spiral tracking logic
│   ├── useShift.ts        # Bluetooth device connection
│   └── useAudio.ts        # Audio playback
│
├── services/              # External service integrations
│   ├── audio/             # Audio playback service
│   ├── bluetooth/         # Bluetooth/Shift integration
│   └── storage/           # Local storage/caching
│
├── assets/                # Static assets
│   ├── audio/             # Guided protocol audio files
│   └── images/            # Icons and images
│
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── tailwind.config.js     # NativeWind/Tailwind config
```

## 🎨 Design System

Based on the DailyHush brand guidelines:

### Colors

- **Primary:** Emerald-600 `#059669`
- **Secondary:** Amber-500 `#F59E0B`
- **Background:** Cream-50 `#FFFEF5`
- **Text:** Slate-900 `#0F172A`

### Typography

- **Minimum font size:** 18pt (for 65+ users)
- **Headings:** 24-32pt, System Bold
- **Body:** 18pt, System Regular
- **Buttons:** 20pt, System Semibold

### Accessibility

- ✅ Dynamic text sizing (up to 200%)
- ✅ VoiceOver compatible
- ✅ High contrast mode (4.5:1 minimum)
- ✅ Large touch targets (44x44pt minimum)
- ✅ Simple gestures only (tap, no swipe/pinch)

## 🔧 Key Technologies

| Technology               | Purpose                             |
| ------------------------ | ----------------------------------- |
| **Expo**                 | React Native framework              |
| **Expo Router**          | File-based routing                  |
| **TypeScript**           | Type safety                         |
| **Supabase**             | Backend (auth, database, real-time) |
| **NativeWind**           | Tailwind CSS for React Native       |
| **Zustand**              | State management                    |
| **react-native-ble-plx** | Bluetooth Low Energy                |
| **expo-av**              | Audio playback                      |
| **expo-haptics**         | Haptic feedback                     |
| **date-fns**             | Date utilities                      |

## 🗄️ Data Architecture

### User Profile

```typescript
{
  user_id: string
  email: string
  age?: number
  quiz_score?: number
  has_shift_necklace: boolean
  fire_progress: { focus, interrupt, reframe, execute }
  triggers: string[]
  peak_spiral_time?: string
}
```

### Spiral Log

```typescript
{
  spiral_id: string
  timestamp: datetime
  trigger?: string
  duration_seconds: number
  pre_feeling: number (1-10)
  post_feeling: number (1-10)
  technique_used: string
  interrupted: boolean
}
```

See `types/index.ts` for complete type definitions.

## 📱 Key User Flows

### 1. Spiral Interrupt (90 seconds)

```
User opens app
   ↓
Giant "I'M SPIRALING" button
   ↓
Immediate audio guidance starts
   ↓
90-second protocol (breathing + grounding)
   ↓
"How do you feel?" rating
   ↓
Log spiral (optional trigger)
   ↓
Success message
```

### 2. F.I.R.E. Training (Weekly)

```
Notification: "Week 2 lesson ready"
   ↓
Open app → Training card
   ↓
Video lesson (3-5 min)
   ↓
Interactive exercise
   ↓
Worksheet/practice
   ↓
Unlock advanced features
   ↓
Module complete!
```

### 3. The Shift Pairing

```
"Do you have The Shift?"
   ↓
Bluetooth scan
   ↓
Select necklace
   ↓
Pair device
   ↓
Test breathing guidance
   ↓
Auto-log spiral interrupts
```

## 🎯 Success Metrics (Year 1)

| Metric                     | Target  |
| -------------------------- | ------- |
| **Downloads**              | 50,000  |
| **DAU/MAU**                | 40%+    |
| **Spiral Interrupts/Day**  | 3+      |
| **7-Day Retention**        | 60%+    |
| **30-Day Retention**       | 40%+    |
| **Free → Paid Conversion** | 10%     |
| **MRR**                    | $50,000 |
| **App Store Rating**       | 4.5+    |

## 🚢 Development Roadmap

### ✅ Phase 1: MVP (Months 1-4)

- [x] Project scaffolding
- [x] Design system
- [x] Type definitions
- [ ] Onboarding flow
- [ ] Spiral interrupt feature
- [ ] F.I.R.E. training modules
- [ ] Pattern insights dashboard
- [ ] Shift Bluetooth integration
- [ ] 3AM Mode

### 📅 Phase 2: Enhancement (Months 5-8)

- [ ] Apple Watch app
- [ ] Advanced pattern detection (AI)
- [ ] Voice journaling
- [ ] Android version

### 📅 Phase 3: Community (Months 9-12)

- [ ] Accountability partners
- [ ] Anonymous sharing
- [ ] Expert Q&A sessions
- [ ] B2B therapist dashboard

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### Manual Testing Checklist

- [ ] Spiral interrupt completes in <90 seconds
- [ ] Audio plays without buffering
- [ ] Bluetooth pairs with Shift necklace
- [ ] 3AM mode activates at night
- [ ] VoiceOver works on all screens
- [ ] Text scales to 200%
- [ ] All touch targets are 44x44pt+

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [PRD (Product Requirements Document)](./docs/DAILYHUSH_MOBILE_APP_PRD.md)

## 🤝 Contributing

### Code Style

- Use TypeScript for all new files
- Follow Prettier formatting (run `npm run format`)
- Use functional components with hooks
- Add JSDoc comments for complex functions
- Follow accessibility guidelines (WCAG 2.1 AA)

### Commit Messages

```
feat: add spiral interrupt protocol
fix: resolve bluetooth connection issue
docs: update README with setup instructions
style: format code with prettier
refactor: simplify state management
test: add unit tests for spiral logging
```

### Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit
3. Run tests: `npm test && npm run type-check`
4. Format code: `npm run format`
5. Push and create PR
6. Request review from team

## 📄 License

Proprietary - DailyHush, Inc.

## 📞 Support

- **Email:** support@dailyhush.com
- **Documentation:** https://docs.dailyhush.com
- **Issues:** [GitHub Issues](https://github.com/dailyhush/mobile-app/issues)

---

**Made with ❤️ for women who deserve peace of mind**
