console.log('Payment script loaded');

async function testPayment(bundleId = 'BB') {
    try {
        console.log('Test payment initiated');
        
        const response = await fetch('/.netlify/functions/createCheckout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bundle: bundleId
            })
        });

        console.log('Response status:', response.status);
        const rawResponse = await response.text();
        console.log('Raw server response:', rawResponse);

        if (!response.ok) {
            throw new Error(`Checkout failed: ${rawResponse}`);
        }

        const data = JSON.parse(rawResponse);

        if (data.url) {
            window.location = data.url;
        } else {
            throw new Error('No checkout URL received');
        }

    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment setup failed. Please try again.');
    }
}

// Make testPayment available globally
window.testPayment = testPayment;