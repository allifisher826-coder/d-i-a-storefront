/**
 * Create Stripe Checkout Session
 * Called by index.html for redirect-based checkout
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Server-side product catalog for price verification
const PRODUCT_CATALOG = {
  1: { name: 'Signature Systems Tracksuit', price: 29900 },
  2: { name: 'Culture of Discipline Hoodie', price: 16900 },
  3: { name: 'Mineral Wash Performance Shorts', price: 9900 },
  4: { name: 'Do It Anyway Oversized Tee', price: 8900 },
  'DIA-TRACKSUIT-001': { name: 'Signature Systems Tracksuit', price: 29900 },
  'DIA-HOODIE-001': { name: 'Culture of Discipline Hoodie', price: 16900 },
  'DIA-TEE-001': { name: 'Do It Anyway Oversized Tee', price: 8900 },
  'DIA-SYSTEM-000': { name: 'System 000 // Foundational Vintage Tee', price: 5500 },
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
    const { items, currency } = JSON.parse(event.body);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No items provided' }),
      };
    }

    // Build line items with SERVER-SIDE price validation
    const line_items = items.map(item => {
      const key = item.id || item.sku;
      const catalogItem = PRODUCT_CATALOG[key];
      
      // Use server-side price, NOT client-sent price
      const unitPrice = catalogItem ? catalogItem.price : Math.round(item.price * 100);
      const name = catalogItem ? catalogItem.name : item.name;

      return {
        price_data: {
          currency: currency || 'nzd',
          product_data: {
            name: name,
            metadata: { sku: item.sku || String(item.id) },
          },
          unit_amount: unitPrice,
        },
        quantity: item.quantity || 1,
      };
    });

    const siteUrl = process.env.SITE_URL || 'https://doitanyway.netlify.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${siteUrl}/order-confirmation.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/`,
      shipping_address_collection: {
        allowed_countries: ['NZ', 'AU', 'US', 'GB', 'CA'],
      },
      metadata: {
        item_count: String(items.length),
        items: JSON.stringify(items.map(i => ({ 
          id: i.id || i.sku, 
          name: i.name, 
          qty: i.quantity || 1 
        }))),
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ url: session.url, sessionId: session.id }),
    };
  } catch (error) {
    console.error('Checkout session error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
