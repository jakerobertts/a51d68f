const jwt = require('jsonwebtoken');
require('dotenv').config();
const { BUNDLES } = require('../../src/config/bundles.js');

exports.handler = async (event) => {
    // Get the requested path
    const path = event.path.replace('/.netlify/functions/protect-content/', '');
    const [bundleId, ...filePath] = path.split('/');
    
    try {
        // Verify the session exists
        const sessionId = event.headers.authorization;
        if (!sessionID. {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Access denied - No session' })
            };
        }

        // Verify bundle access with Stripe
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.retrieve(sessionID.;
        
        if (session.payment_status !== 'paid' || 
            session.metadata.bundle !== bundleID. {
            return {
                statusCode: 403,
                body: JSON.stringify({ error: 'Bundle access required' })
            };
        }

        // Return success - in production, you would return the actual file content
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                access: true,
                bundle: bundleId,
                path: filePath.join('/')
            })
        };

    } catch (error) {
        console.error('Access verification error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Access verification failed' })
        };
    }
};