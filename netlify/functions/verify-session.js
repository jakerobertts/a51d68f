require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { sessionId } = JSON.parse(event.body);
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true,
                    bundle: session.metadata.bundle,
                    customerEmail: session.customer_details.email
                })
            };
        }

        throw new Error('Payment not completed');

    } catch (error) {
        console.error('Verification error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                success: false,
                error: error.message 
            })
        };
    }
};