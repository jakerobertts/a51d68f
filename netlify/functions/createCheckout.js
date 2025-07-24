require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    console.log('Checkout function called');

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Percentyle Full Access',
                        description: 'Unlimited access to all content and quizzes'
                    },
                    unit_amount: 2299, // $22.99 in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.URL || 'http://localhost:8888'}/organs.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.URL || 'http://localhost:8888'}/`,
            metadata: {
                access: 'full'
            }
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: session.url
            })
        };

    } catch (error) {
        console.error('Checkout error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};