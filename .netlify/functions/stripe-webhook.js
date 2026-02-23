/**
 * Stripe Webhook Handler for Netlify Functions
 * Handles payment success → Printful order creation
 * 
 * Deploy to: .netlify/functions/stripe-webhook.js
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405 };
  }

  try {
    const sig = event.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        sig,
        webhookSecret
      );
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Webhook signature verification failed' }),
      };
    }

    // Handle payment success
    if (stripeEvent.type === 'payment_intent.succeeded') {
      const paymentIntent = stripeEvent.data.object;

      // Create order in Printful
      const itemsMetadata = JSON.parse(paymentIntent.metadata.items);

      const printfulOrder = {
        external_id: paymentIntent.id,
        shipping: 'STANDARD',
        items: itemsMetadata.map(item => ({
          external_id: `${item.sku}-${item.size}`,
          quantity: 1,
        })),
      };

      // Send to Printful
      const printfulResponse = await fetch('https://api.printful.com/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_TOKEN}`,
          'Content-Type': 'application/json',
          'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID,
        },
        body: JSON.stringify({ order: printfulOrder }),
      });

      if (!printfulResponse.ok) {
        const error = await printfulResponse.json();
        console.error('Printful error:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Printful order creation failed' }),
        };
      }

      console.log(`✓ Payment succeeded and order created: ${paymentIntent.id}`);

      return {
        statusCode: 200,
        body: JSON.stringify({ received: true }),
      };
    }

    // Other events
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };

  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
