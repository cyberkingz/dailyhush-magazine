import Stripe from 'stripe'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function createCoachingProduct() {
  try {
    console.log('Creating F.I.R.E. Coaching Call product...')

    // Create the product
    const product = await stripe.products.create({
      name: 'F.I.R.E. STARTER KIT - 1-on-1 Coaching Call',
      description: '60-minute personalized strategy call with an expert coach. Get a custom implementation plan, personalized roadmap review, live Q&A, and actionable next steps to fast-track your F.I.R.E. implementation.',
      metadata: {
        type: 'coaching_call',
        duration: '60_minutes',
        upsell_from: 'fire_starter_kit'
      }
    })

    console.log('✅ Product created:', product.id)

    // Create the price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 15000, // $150.00 in cents
      currency: 'usd',
      metadata: {
        original_price: '29700', // $297 for comparison
        discount_percent: '50'
      }
    })

    console.log('✅ Price created:', price.id)

    console.log('\n=== ADD THESE TO YOUR .env FILES ===')
    console.log(`STRIPE_COACHING_CALL_PRODUCT_ID=${product.id}`)
    console.log(`STRIPE_COACHING_CALL_PRICE_ID=${price.id}`)
    console.log('\n=== PRODUCT DETAILS ===')
    console.log('Product ID:', product.id)
    console.log('Price ID:', price.id)
    console.log('Amount:', '$150.00')
    console.log('Dashboard URL:', `https://dashboard.stripe.com/products/${product.id}`)

  } catch (error) {
    console.error('❌ Error creating product:', error.message)
    process.exit(1)
  }
}

createCoachingProduct()
