#!/bin/bash

# Deploy Supabase Edge Functions
# Usage: ./deploy.sh [function-name]
# If no function name provided, deploys all functions

set -e

echo "🚀 Deploying Supabase Edge Functions..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if user is logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run:"
    echo "   supabase login"
    exit 1
fi

# Deploy specific function or all functions
if [ -n "$1" ]; then
    echo "📦 Deploying function: $1"
    supabase functions deploy "$1" --no-verify-jwt
else
    echo "📦 Deploying all functions..."
    supabase functions deploy --no-verify-jwt
fi

echo "✅ Deployment complete!"
echo ""
echo "📊 View logs:"
echo "   supabase functions logs delete-account"
echo ""
echo "🧪 Test locally:"
echo "   supabase functions serve delete-account"
