/**
 * F.I.R.E. STARTER KIT Stripe Product Setup Script
 * 
 * This script creates the Stripe product and price for the F.I.R.E. STARTER KIT
 * Run this after configuring your Stripe secret key in environment variables
 * 
 * Usage: node scripts/setup-stripe-product.js
 */

import { config } from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
config();

console.log('Checking Stripe configuration...');

// Use live key for production
const stripeKey = process.env.STRIPE_SECRET_KEY;
console.log('Using key type:', stripeKey?.startsWith('sk_test_') ? 'TEST' : 'LIVE');
console.log('STRIPE_SECRET_KEY exists:', !!stripeKey);

if (!stripeKey) {
  console.error('❌ STRIPE_SECRET_KEY or STRIPE_SECRET_KEY_TEST environment variable is required');
  console.log('Set it in your .env file: STRIPE_SECRET_KEY=sk_test_...');
  process.exit(1);
}

const stripe = new Stripe(stripeKey);

async function createFireStarterProduct() {
  try {
    console.log('🔥 Creating F.I.R.E. STARTER KIT product...');
    
    // Create the product
    const product = await stripe.products.create({
      name: 'F.I.R.E. STARTER KIT',
      description: 'The complete system that turns "someday entrepreneurs" into launched founders. 0 overload, 1 single database, 9 pre-filled steps, publish in 48h.',
      images: [
        // Add your product image URL here
        'https://dailyhush.com/fire-starter-kit-cover.png'
      ],
      metadata: {
        product_type: 'digital',
        category: 'productivity',
        launch_framework: 'true',
        notion_template: 'true'
      }
    }, {
      idempotencyKey: 'fire-starter-product-live-2025'
    });

    console.log('✅ Product created:', product.id);

    // Create the price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2700, // $27.00 in cents
      currency: 'usd',
      nickname: 'F.I.R.E. STARTER KIT - One-time',
      metadata: {
        display_name: '$27 one-time payment',
        launch_special: 'true'
      }
    }, {
      idempotencyKey: 'fire-starter-price-live-2025'
    });

    console.log('✅ Price created:', price.id);

    // Output configuration for .env
    console.log('\n📋 Add this to your .env file:');
    console.log(`STRIPE_FIRE_STARTER_PRICE_ID=${price.id}`);
    console.log('\n🎯 Product setup complete! Your F.I.R.E. STARTER KIT is ready for sales.');
    
    return {
      product: product.id,
      price: price.id
    };

  } catch (error) {
    console.error('❌ Error creating Stripe product:', error.message);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('\n💡 Make sure your STRIPE_SECRET_KEY is set in your environment variables');
    }
    
    process.exit(1);
  }
}

// Run the setup
if (import.meta.url === `file://${process.argv[1]}`) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY environment variable is required');
    console.log('Set it in your .env file: STRIPE_SECRET_KEY=sk_test_...');
    process.exit(1);
  }

  createFireStarterProduct()
    .then(() => {
      console.log('\n🚀 Next steps:');
      console.log('1. Configure your webhook endpoint in Stripe Dashboard');
      console.log('2. Add the webhook secret to STRIPE_WEBHOOK_SECRET');
      console.log('3. Create your Notion template and add URL to FIRE_STARTER_NOTION_TEMPLATE_URL');
      console.log('4. Test the checkout flow on your Ship48 page');
      console.log('\nSee STRIPE_SETUP.md for detailed instructions!');
    })
    .catch(console.error);
}

export { createFireStarterProduct };