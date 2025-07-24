console.log('Payment script loaded');

async function handleBundlePurchase(bundleType) {
    try {
        const response = await fetch('/.netlify/functions/createCheckout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bundle: bundleType
            })
        });

        // Log the raw response for debugging
        const responseText = await response.text();
        console.log('Raw server response:', responseText);

        // Try to parse as JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse server response:', e);
            throw new Error('Invalid server response');
        }

        if (!data.url) {
            throw new Error('No checkout URL in response');
        }

        // Redirect to Stripe checkout
        window.location.href = data.url;

    } catch (error) {
        console.error('Payment initialization error:', error);
        alert('Payment setup failed. Please try again.');
    }
}

// Test payment function
async function testPayment() {
    console.log('Test payment initiated');
    await handleBundlePurchase('BB');
}