/**
 * Serverless Payment API for Netlify Functions
 * Creates Stripe payment intents
 * 
 * Deploy to: .netlify/functions/create-payment-intent.js
 */

const stripe = require('stripe')(process.env.STRIPE_API_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { items, amount } = JSON.parse(event.body);

    if (!items || !amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing items or amount' }),
      };
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd',
      metadata: {
        items: JSON.stringify(items.map(item => ({
          sku: item.sku,
          size: item.size,
          price: item.price,
        }))),
        item_count: items.length,
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
    };
  } catch (error) {
    console.error('Payment error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
