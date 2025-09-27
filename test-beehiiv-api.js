/**
 * Test script to verify beehiiv API integration
 * Run this with: node test-beehiiv-api.js
 */

const BEEHIIV_API_KEY = 'FKsKmlKu8djPv4hxsv3KPendj9ry7HKySQycpGTnKN6XRwmtoms1o55qkO4DZSba';
const BEEHIIV_PUBLICATION_ID = 'pub_1b81dc77-29e4-4eaf-9256-ccc5502e0121';

async function testBeehiivSubscription() {
  console.log('🐝 Testing Beehiiv API Integration\n');
  console.log('Publication ID:', BEEHIIV_PUBLICATION_ID);
  console.log('API Key:', BEEHIIV_API_KEY.substring(0, 10) + '...\n');

  const testEmail = `test_${Date.now()}@example.com`;
  
  // According to official beehiiv API docs
  const requestBody = {
    email: testEmail,
    reactivate_existing: false,  // Reactivate if email already exists
    send_welcome_email: true,     // Send confirmation email
    utm_source: 'api_test',
    utm_medium: 'direct', 
    utm_campaign: 'test',
    referring_site: 'http://localhost:5173'  // Your site URL
  };

  console.log('📤 Request Body:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    console.log('\n📨 Response Status:', response.status, response.statusText);
    
    const responseData = await response.json();
    console.log('📨 Response Data:', JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log('\n✅ SUCCESS! Subscription created for:', testEmail);
      console.log('Check your beehiiv dashboard for this email.');
    } else {
      console.log('\n❌ ERROR:', responseData.message || 'Unknown error');
      
      // Common issues and solutions
      if (response.status === 401) {
        console.log('\n🔧 Fix: Check your API key is correct and has proper permissions');
      } else if (response.status === 404) {
        console.log('\n🔧 Fix: Check your publication ID is correct');
      } else if (response.status === 400) {
        console.log('\n🔧 Fix: Check the request body format');
        console.log('Common issues:');
        console.log('- Use snake_case (reactivate_existing, not reactivateExisting)');
        console.log('- Email must be valid format');
        console.log('- Publication must exist and be active');
      }
    }

  } catch (error) {
    console.error('\n❌ Network Error:', error.message);
    console.log('\n🔧 Fix: Check your internet connection and try again');
  }

  // Test listing subscriptions
  console.log('\n\n📋 Testing List Subscriptions...');
  try {
    const listResponse = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions?limit=5`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
        }
      }
    );

    const listData = await listResponse.json();
    console.log('Total subscriptions:', listData.total_results || 0);
    if (listData.data && listData.data.length > 0) {
      console.log('Recent subscriptions:');
      listData.data.slice(0, 3).forEach(sub => {
        console.log(`- ${sub.email} (status: ${sub.status})`);
      });
    }
  } catch (error) {
    console.error('Failed to list subscriptions:', error.message);
  }
}

// Check n8n webhook format
function checkN8nWebhookFormat() {
  console.log('\n\n🔧 N8N WEBHOOK CONFIGURATION\n');
  console.log('Your n8n HTTP Request node should be configured as follows:\n');
  
  console.log('Method: POST');
  console.log('URL: https://api.beehiiv.com/v2/publications/{{$json.beehiiv_publication_id}}/subscriptions');
  console.log('\nHeaders:');
  console.log('  Authorization: Bearer YOUR_BEEHIIV_API_KEY');
  console.log('  Content-Type: application/json');
  console.log('\nBody (JSON):');
  console.log(JSON.stringify({
    email: '{{$json.email}}',
    reactivate_existing: false,
    send_welcome_email: true,
    utm_source: '{{$json.utm_source}}',
    utm_medium: '{{$json.utm_medium}}',
    utm_campaign: '{{$json.utm_campaign}}',
    referring_site: '{{$json.source_page}}'
  }, null, 2));
  
  console.log('\n⚠️  IMPORTANT: Use snake_case in the JSON body (not camelCase)!');
  console.log('   ❌ Wrong: reactivateExisting, sendWelcomeEmail');
  console.log('   ✅ Right: reactivate_existing, send_welcome_email');
}

// Run tests
console.log('========================================');
console.log('   BEEHIIV API INTEGRATION TEST');
console.log('========================================\n');

testBeehiivSubscription().then(() => {
  checkN8nWebhookFormat();
});