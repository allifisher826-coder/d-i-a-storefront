/**
 * Create Stripe Payment Intent
 * Called by store.html for Stripe Elements inline checkout
 * 
 * SECURITY: Calculates amount server-side from product catalog
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Server-side price catalog (amounts in cents)
const PRICE_CATALOG = {
  'DIA-TRACKSUIT-001': 29900,
  'DIA-HOODIE-001': 16900,
  'DIA-TEE-001': 8900,
  'DIA-SYSTEM-000': 5500,
};

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { items, email } = JSON.parse(event.body);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing items' }),
      };
    }

    // Calculate amount SERVER-SIDE — never trust client-sent amount
    let totalAmount = 0;
    for (const item of items) {
      const catalogPrice = PRICE_CATALOG[item.sku];
      if (!catalogPrice) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Unknown product: ${item.sku}` }),
        };
      }
      totalAmount += catalogPrice * (item.quantity || 1);
    }

    const paymentIntentData = {
      amount: totalAmount,
      currency: 'nzd',
      metadata: {
        items: JSON.stringify(items.map(item => ({
          sku: item.sku,
          size: item.size,
          quantity: item.quantity || 1,
        }))),
        item_count: String(items.length),
      },
    };

    // Attach receipt email if provided
    if (email) {
      paymentIntentData.receipt_email = email;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: totalAmount,
      }),
    };
  } catch (error) {
    console.error('Payment intent error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
