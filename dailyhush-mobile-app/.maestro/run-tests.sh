#!/bin/bash

# DailyHush - Maestro Test Runner
# Easy script to run E2E tests with visual UI

set -e

echo "🎭 DailyHush - Maestro E2E Tests"
echo "================================"
echo ""

# Check if Maestro is installed
if ! command -v maestro &> /dev/null; then
    echo "❌ Maestro is not installed!"
    echo "Install it with: curl -Ls \"https://get.maestro.mobile.dev\" | bash"
    exit 1
fi

echo "✅ Maestro is installed"
echo ""

# Check if app is running
echo "📱 Make sure your app is running (npm start)"
echo "   Press ENTER to continue..."
read

echo ""
echo "Select test to run:"
echo "1. Happy Path - Complete Onboarding (WATCH UI!)"
echo "2. Existing Email - Redirect to Login"
echo "3. Quiz Lookup - Connect Website Quiz"
echo "4. Validation Errors"
echo "5. Run ALL tests"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
  1)
    echo ""
    echo "🎬 Running: Happy Path Test"
    echo "👀 WATCH YOUR SIMULATOR - You'll see the UI move!"
    echo ""
    maestro test .maestro/01-onboarding-happy-path.yaml
    ;;
  2)
    echo ""
    echo "🎬 Running: Existing Email Test"
    echo "👀 WATCH YOUR SIMULATOR - You'll see the redirect!"
    echo ""
    maestro test .maestro/02-existing-email-redirect.yaml
    ;;
  3)
    echo ""
    echo "🎬 Running: Quiz Lookup Test"
    echo "👀 WATCH YOUR SIMULATOR - You'll see the lookup flow!"
    echo ""
    maestro test .maestro/03-quiz-lookup-flow.yaml
    ;;
  4)
    echo ""
    echo "🎬 Running: Validation Errors Test"
    echo "👀 WATCH YOUR SIMULATOR - You'll see errors appear!"
    echo ""
    maestro test .maestro/04-validation-errors.yaml
    ;;
  5)
    echo ""
    echo "🎬 Running: ALL Tests"
    echo "👀 WATCH YOUR SIMULATOR - Sit back and enjoy the show!"
    echo ""
    maestro test .maestro/
    ;;
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "✅ Test completed!"
echo ""
