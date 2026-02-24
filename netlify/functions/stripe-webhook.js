/**
 * Stripe Webhook Handler
 * Handles payment success → Printful order creation
 * 
 * Handles both:
 * - checkout.session.completed (from index.html Checkout flow)
 * - payment_intent.succeeded (from store.html Elements flow)
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405 };
  }

  try {
    const sig = event.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature failed:', err.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Webhook signature verification failed' }),
      };
    }

    console.log(`Received event: ${stripeEvent.type}`);

    // Handle Checkout Session completion (index.html flow)
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      console.log(`✓ Checkout completed: ${session.id}`);
      
      // Shipping address is collected by Stripe Checkout
      const shipping = session.shipping_details || session.customer_details;
      const itemsData = session.metadata?.items ? JSON.parse(session.metadata.items) : [];

      await createPrintfulOrder(session.id, itemsData, shipping);
    }

    // Handle Payment Intent success (store.html flow)
    if (stripeEvent.type === 'payment_intent.succeeded') {
      const paymentIntent = stripeEvent.data.object;
      console.log(`✓ Payment succeeded: ${paymentIntent.id}`);

      const itemsData = paymentIntent.metadata?.items 
        ? JSON.parse(paymentIntent.metadata.items) 
        : [];

      // Note: Payment Intents don't collect shipping — 
      // shipping must be collected client-side and included in metadata
      await createPrintfulOrder(paymentIntent.id, itemsData, null);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };

  } catch (error) {
    console.error('Webhook error:', error);
    // Return 200 to prevent Stripe retries that could cause duplicates
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true, warning: 'Handler error logged' }),
    };
  }
};

/**
 * Create order in Printful
 * Falls back gracefully if Printful isn't configured
 */
async function createPrintfulOrder(orderId, items, shipping) {
  const printfulToken = process.env.PRINTFUL_API_TOKEN;
  
  if (!printfulToken) {
    console.log('⚠ Printful not configured — order logged but not submitted');
    console.log('Order:', orderId, 'Items:', JSON.stringify(items));
    return;
  }

  try {
    const printfulOrder = {
      external_id: orderId,
      shipping: 'STANDARD',
      recipient: shipping ? {
        name: shipping.name || 'Customer',
        address1: shipping.address?.line1 || '',
        address2: shipping.address?.line2 || '',
        city: shipping.address?.city || '',
        state_code: shipping.address?.state || '',
        country_code: shipping.address?.country || 'NZ',
        zip: shipping.address?.postal_code || '',
        email: shipping.email || '',
      } : undefined,
      items: items.map(item => ({
        external_id: `${item.sku || item.id}-${item.size || 'OS'}`,
        quantity: item.quantity || item.qty || 1,
        // variant_id must be mapped from your Printful catalog
        // This will need real Printful variant IDs
      })),
    };

    const response = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${printfulToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(printfulOrder),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Printful error:', error);
    } else {
      console.log(`✓ Printful order created for ${orderId}`);
    }
  } catch (error) {
    console.error('Printful submission failed:', error.message);
    // Don't throw — payment already succeeded
  }
}
