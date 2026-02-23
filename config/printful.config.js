/**
 * Printful Integration Module
 * Handles automated print-on-demand order submission
 * 
 * SETUP:
 * 1. Create Printful account: https://printful.com
 * 2. Upload product designs to Printful
 * 3. Get API token from Printful account settings
 * 4. Set PRINTFUL_API_TOKEN in .env
 */

// ============================================
// PRINTFUL API CONFIGURATION
// ============================================

const PRINTFUL_CONFIG = {
  apiToken: process.env.PRINTFUL_API_TOKEN,
  baseUrl: 'https://api.printful.com',
  
  // Map product IDs to Printful variant IDs
  // Example: { "1": 4001, "2": 4002, ... }
  // Get these from Printful dashboard
  productVariantMap: {
    "1": 4001,  // Signature Systems Tracksuit
    "2": 4002,  // Culture of Discipline Hoodie
    "3": 4003,  // Mineral Wash Performance Shorts
    "4": 4004   // Do It Anyway Oversized Tee
  }
};

// ============================================
// SUBMIT ORDER TO PRINTFUL
// ============================================

/**
 * Submit an order to Printful for fulfillment
 * 
 * @param {Array} cartItems - Cart items from checkout
 * @param {String} email - Customer email
 * @param {String} stripeSessionId - Stripe session ID for tracking
 */
async function submitPrintfulOrder(cartItems, email, stripeSessionId) {
  try {
    console.log('📤 Submitting order to Printful:', email);
    
    // Convert cart items to Printful format
    const items = cartItems.map(item => ({
      variant_id: PRINTFUL_CONFIG.productVariantMap[item.id],
      quantity: item.qty,
      retail_price: item.price
    }));
    
    const orderData = {
      external_id: stripeSessionId, // Link to Stripe session
      shipping: 'STANDARD',          // Printful shipping method
      items: items,
      recipient: {
        email: email
        // Add address details from checkout form
      }
    };
    
    const response = await fetch(`${PRINTFUL_CONFIG.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_CONFIG.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Order submitted to Printful:', result.data.id);
    
    return result.data;
    
  } catch (error) {
    console.error('❌ Printful submission failed:', error);
    throw error;
  }
}

// ============================================
// GET ORDER STATUS
// ============================================

/**
 * Check Printful order status
 * Call this to get tracking info, shipping status, etc.
 */
async function getPrintfulOrderStatus(printfulOrderId) {
  try {
    const response = await fetch(
      `${PRINTFUL_CONFIG.baseUrl}/orders/${printfulOrderId}`,
      {
        headers: {
          'Authorization': `Bearer ${PRINTFUL_CONFIG.apiToken}`
        }
      }
    );
    
    if (!response.ok) throw new Error('Failed to fetch order status');
    
    const result = await response.json();
    return result.data;
    
  } catch (error) {
    console.error('Failed to get order status:', error);
    return null;
  }
}

// ============================================
// HANDLE PRINTFUL WEBHOOKS
// ============================================

/**
 * Process webhook from Printful
 * Updates order status, sends tracking to customer, etc.
 */
async function handlePrintfulWebhook(event) {
  const { type, data } = event;
  
  console.log('🔔 Printful webhook:', type);
  
  switch (type) {
    case 'order_created':
      console.log('📦 Order created in Printful');
      // Store order mapping in database
      break;
      
    case 'order_updated':
      console.log('✏️ Order status updated');
      // Update customer with new status
      handleOrderStatusChange(data);
      break;
      
    case 'order_shipped':
      console.log('🚚 Order shipped!');
      // Send tracking info to customer
      sendTrackingEmail(data.external_id, data.tracking_number);
      break;
      
    case 'order_failed':
      console.error('❌ Order failed:', data.failure_reason);
      // Alert customer, trigger retry logic
      break;
      
    default:
      console.log('Unknown webhook type:', type);
  }
}

// ============================================
// SYNC PRODUCTS FROM PRINTFUL
// ============================================

/**
 * Sync product catalog from Printful to local database
 * Run this once during setup, then periodically
 */
async function syncPrintfulProducts() {
  try {
    console.log('🔄 Syncing Printful products...');
    
    const response = await fetch(
      `${PRINTFUL_CONFIG.baseUrl}/products`,
      {
        headers: {
          'Authorization': `Bearer ${PRINTFUL_CONFIG.apiToken}`
        }
      }
    );
    
    if (!response.ok) throw new Error('Failed to sync products');
    
    const result = await response.json();
    
    // Store products in database
    const products = result.data.map(p => ({
      externalId: p.id,
      name: p.title,
      description: p.description,
      image: p.image,
      variants: p.variants
    }));
    
    console.log(`✅ Synced ${products.length} products`);
    return products;
    
  } catch (error) {
    console.error('Product sync failed:', error);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function handleOrderStatusChange(orderData) {
  // Update database, notify customer
  console.log('Status change:', orderData.status);
}

function sendTrackingEmail(stripeSessionId, trackingNumber) {
  // Integration with Klaviyo
  console.log(`Sending tracking ${trackingNumber} for order ${stripeSessionId}`);
}

// ============================================
// EXPORT
// ============================================

module.exports = {
  PRINTFUL_CONFIG,
  submitPrintfulOrder,
  getPrintfulOrderStatus,
  handlePrintfulWebhook,
  syncPrintfulProducts
};

/**
 * INTEGRATION CHECKLIST:
 * 
 * [ ] Create Printful account
 * [ ] Set up product variants in Printful dashboard
 * [ ] Get API token from account settings
 * [ ] Add token to .env
 * [ ] Map product IDs to Printful variant IDs
 * [ ] Test order submission with test order
 * [ ] Set up Printful webhooks in dashboard
 * [ ] Add webhook endpoint to Stripe callback
 * [ ] Test order status updates
 * [ ] Configure shipping methods and pricing
 * [ ] Set up tracking email notifications
 * [ ] Test full order-to-fulfillment flow
 */
