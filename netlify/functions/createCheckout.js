require('dotenv').config();

// Validate environment without exposing keys in logs
if (!process.env.STRIPE_SECRET_KEY?.startsWith('sk_')) {
    throw new Error('Invalid Stripe configuration');
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    console.log('Checkout function called');

    // Validate request method
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        let bundle;
        try {
            const body = JSON.parse(event.body);
            bundle = body.bundle;
        } catch (err) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid JSON in request body' })
            };
        }

        if (!bundle) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing bundle property in request body' })
            };
        }

        console.log('Processing bundle:', bundle);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `MCAT ${bundle} Bundle`
                    },
                    unit_amount: bundle === 'BB' ? 999 : bundle === 'CP' ? 499 : 599
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${process.env.URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.URL}/`,
            metadata: {
                bundle
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
        console.error('Stripe error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};