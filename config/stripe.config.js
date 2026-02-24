/**
 * Stripe Integration Module
 * Handles payment processing, checkout, and webhook verification
 * 
 * SETUP:
 * 1. Get API keys from stripe.com/account/apikeys
 * 2. Set STRIPE_PUBLIC_KEY in .env
 * 3. Add webhook endpoint to stripe.com/account/webhooks
 * 4. Set STRIPE_WEBHOOK_SECRET in .env
 */

// ============================================
// STRIPE CONFIGURATION
// ============================================

const STRIPE_CONFIG = {
  publicKey: process.env.STRIPE_PUBLIC_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  
  // Success/Failure URLs (update with your domain)
  successUrl: process.env.SITE_URL ? `${process.env.SITE_URL}/order-confirmation.html` : 'https://doitanyway.netlify.app/order-confirmation.html',
  cancelUrl: process.env.SITE_URL || 'https://doitanyway.netlify.app',
  
  // Webhook events to listen for
  eventsToHandle: [
    'checkout.session.completed',
    'charge.succeeded',
    'charge.failed',
    'charge.refunded'
  ]
};

// ============================================
// STRIPE CHECKOUT SESSION
// ============================================

/**
 * Create a Stripe Checkout Session
 * Call this when user clicks "Checkout Now"
 * 
 * @param {Array} cartItems - Array of {name, price, quantity, id}
 * @param {String} customerEmail - Customer email address
 * @returns {String} checkout session URL
 */
async function createCheckoutSession(cartItems, customerEmail) {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems,
        email: customerEmail,
        successUrl: STRIPE_CONFIG.successUrl,
        cancelUrl: STRIPE_CONFIG.cancelUrl
      })
    });
    
    const { sessionId, url } = await response.json();
    
    if (url) {
      window.location.href = url; // Redirect to Stripe Checkout
    }
    
    return sessionId;
  } catch (error) {
    console.error('Checkout creation failed:', error);
    alert('Payment processing failed. Please try again.');
  }
}

// ============================================
// WEBHOOK HANDLER (Server-side)
// ============================================

/**
 * Verify Stripe webhook and process event
 * This runs on your server (Node.js backend)
 * 
 * @param {String} body - Raw request body
 * @param {String} signature - Stripe signature header
 */
function handleStripeWebhook(body, signature) {
  let event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.webhookSecret
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return { error: 'Invalid signature' };
  }
  
  // Handle specific events
  switch (event.type) {
    case 'checkout.session.completed':
      handleCheckoutComplete(event.data.object);
      break;
      
    case 'charge.succeeded':
      handleChargeSuccess(event.data.object);
      break;
      
    case 'charge.failed':
      handleChargeFailed(event.data.object);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  return { received: true };
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Called when checkout session completes
 * Trigger order fulfillment, send confirmation email, etc.
 */
function handleCheckoutComplete(session) {
  console.log('✅ Checkout complete:', session.id);
  
  const {
    id,
    customer_email,
    payment_status,
    amount_total,
    metadata
  } = session;
  
  // Extract cart data from metadata
  const cartData = metadata.cartItems ? JSON.parse(metadata.cartItems) : [];
  
  // STEPS:
  // 1. Save order to database
  // 2. Submit to Printful/Printify
  // 3. Send confirmation email via Klaviyo
  // 4. Update customer CRM
  
  submitPrintfulOrder(cartData, customer_email, session.id);
  sendOrderConfirmation(customer_email, amount_total, session.id);
}

function handleChargeSuccess(charge) {
  console.log('💳 Charge succeeded:', charge.id);
  // Update order status in database
}

function handleChargeFailed(charge) {
  console.error('❌ Charge failed:', charge.id, charge.failure_message);
  // Notify customer, trigger retry logic
}

// ============================================
// EXPORT
// ============================================

export {
  STRIPE_CONFIG,
  createCheckoutSession,
  handleStripeWebhook,
  handleCheckoutComplete
};

/**
 * INTEGRATION CHECKLIST:
 * 
 * [ ] Install stripe npm package: npm install stripe
 * [ ] Get API keys from Stripe dashboard
 * [ ] Add keys to .env file
 * [ ] Create /api/create-checkout-session endpoint
 * [ ] Create /api/webhook endpoint for stripe webhooks
 * [ ] Add webhook URL to Stripe dashboard
 * [ ] Test with Stripe test cards
 * [ ] Connect to Printful API for order fulfillment
 * [ ] Connect to Klaviyo for email confirmations
 * [ ] Test full checkout flow end-to-end
 * [ ] Go live with production keys
 */
