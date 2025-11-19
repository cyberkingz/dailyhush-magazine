# DailyHush - E2E Testing with Maestro 🎭

Visual end-to-end testing for the DailyHush onboarding flow. **Watch the UI move, type text, and navigate screens automatically!**

## 🚀 Quick Start

### 1. Start Your App

```bash
# Start Expo app
npm start

# Then press 'i' for iOS simulator or 'a' for Android emulator
```

### 2. Run Tests (Watch the Magic!)

```bash
# Run ALL tests and watch the UI
maestro test .maestro/

# Run specific test
maestro test .maestro/01-onboarding-happy-path.yaml

# Run with continuous mode (re-runs on file changes)
maestro test --continuous .maestro/01-onboarding-happy-path.yaml
```

## 📱 Visual Testing - See the UI Move!

**Maestro will:**

- ✅ Launch your app on the simulator/device
- ✅ Type text into inputs (you'll see it typing!)
- ✅ Tap buttons and navigate screens
- ✅ Scroll through content
- ✅ Wait for animations
- ✅ Verify text appears on screen

**YOU LITERALLY WATCH IT HAPPEN IN REAL-TIME!** 👀

## 🎬 Recording Test Runs

Want to share test results with your team?

```bash
# Record video of test execution
maestro test --format junit --output report.xml .maestro/01-onboarding-happy-path.yaml

# Take screenshots during test
maestro test --record .maestro/
```

## 🧪 Available Tests

### 1. Happy Path - Complete Onboarding

**File:** `01-onboarding-happy-path.yaml`

**What it tests:**

- ✅ Complete quiz (all 10 questions)
- ✅ Profile setup (name, age, frequency)
- ✅ Account creation (email + password)
- ✅ Results screen display
- ✅ Landing on home screen

**Run:**

```bash
maestro test .maestro/01-onboarding-happy-path.yaml
```

**Expected result:** User completes onboarding and lands on home screen with their name displayed.

---

### 2. Existing Email - Redirect to Login

**File:** `02-existing-email-redirect.yaml`

**What it tests:**

- ✅ User tries to signup with existing email
- ✅ Error message displays
- ✅ Auto-redirect to login screen
- ✅ Email is prefilled on login

**Run:**

```bash
maestro test .maestro/02-existing-email-redirect.yaml
```

**Expected result:** User sees error, then redirected to login with email prefilled.

**NOTE:** Update `existing-user@test.com` with an actual existing email in your database.

---

### 3. Quiz Lookup - Connect Website Quiz

**File:** `03-quiz-lookup-flow.yaml`

**What it tests:**

- ✅ "I already took the quiz" flow
- ✅ Email lookup from quiz_submissions
- ✅ Password setup screen
- ✅ Quiz connection to account
- ✅ Results display

**Run:**

```bash
maestro test .maestro/03-quiz-lookup-flow.yaml
```

**Expected result:** User connects their website quiz and sees results.

**NOTE:** Update `quiz-taker@test.com` with an actual quiz submission email.

---

### 4. Validation Errors

**File:** `04-validation-errors.yaml`

**What it tests:**

- ✅ Invalid email format detection
- ✅ Short password detection
- ✅ Error messages display
- ✅ Valid inputs proceed correctly

**Run:**

```bash
maestro test .maestro/04-validation-errors.yaml
```

**Expected result:** Validation errors show, valid inputs proceed to results.

## 🎯 Test Data Setup

Before running tests, ensure you have:

### For Test 2 (Existing Email):

1. Create a test user in Supabase Auth
2. Update email in test file: `existing-user@test.com`

### For Test 3 (Quiz Lookup):

1. Create a quiz submission in `quiz_submissions` table
2. Update email in test file: `quiz-taker@test.com`

## 🐛 Debugging Tests

### View Detailed Logs

```bash
maestro test --debug-output maestro-logs .maestro/01-onboarding-happy-path.yaml
```

### Interactive Mode (Maestro Studio)

```bash
maestro studio .maestro/01-onboarding-happy-path.yaml
```

This opens a visual editor where you can:

- Step through the test line by line
- See exactly what element is being tapped
- Modify the test in real-time
- **Perfect for debugging!**

### Common Issues

**Test can't find element:**

```yaml
# Instead of:
- tapOn: 'Submit'

# Try with pattern matching:
- tapOn:
    text: '.*Submit.*'
```

**App not launching:**

```bash
# Make sure your app is running first
npm start

# Check if simulator is open
maestro test --device "iPhone 16 Pro" .maestro/01-onboarding-happy-path.yaml
```

## 📊 CI/CD Integration

### Run on GitHub Actions

```yaml
- name: Run Maestro Tests
  uses: mobile-dev-inc/action-maestro-cloud@v1
  with:
    api-key: ${{ secrets.MAESTRO_CLOUD_API_KEY }}
    app-file: app.ipa
    flows: .maestro/
```

### Upload to Maestro Cloud

```bash
# Upload and run tests in the cloud
maestro cloud --apiKey <your-api-key> .maestro/
```

## 🎨 Writing Your Own Tests

### Basic Structure

```yaml
appId: com.dailyhush.app
---
- launchApp

# Assert text is visible
- assertVisible: 'Welcome'

# Tap on element
- tapOn: 'Continue'

# Type text
- inputText: 'Hello World'

# Wait for animations
- waitForAnimationToEnd

# Scroll
- scroll

# Take screenshot
- takeScreenshot: screenshots/home.png
```

### Advanced Actions

```yaml
# Tap on element by ID
- tapOn:
    id: 'submit-button'

# Swipe
- swipe:
    direction: UP

# Assert NOT visible
- assertNotVisible: 'Error'

# Conditional logic
- runFlow:
    when:
      visible: 'Skip'
    file: skip-flow.yaml
```

## 🚀 Pro Tips

1. **Watch Tests Run Live**
   - Open simulator/device
   - Run `maestro test`
   - Watch the magic happen!

2. **Speed Up Tests**

   ```yaml
   # Disable animations in test
   - runScript: adb shell settings put global animator_duration_scale 0
   ```

3. **Create Test Variants**

   ```yaml
   # Use environment variables
   - inputText: '${TEST_EMAIL}'
   ```

4. **Parallel Testing**
   ```bash
   # Run multiple tests at once
   maestro test --parallel .maestro/
   ```

## 📚 Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro Studio Guide](https://maestro.mobile.dev/getting-started/maestro-studio)
- [Best Practices](https://maestro.mobile.dev/best-practices/writing-stable-flows)

## ✅ Next Steps

1. Run the happy path test and watch it!
2. Update test data (emails) for edge cases
3. Add more test scenarios as needed
4. Integrate with CI/CD

---

**Need help?** Check the [Maestro Discord](https://discord.gg/maestro) or open an issue!
