console.log('Payment script loaded');

async function testPayment() {
    console.log('Test payment initiated');
    try {
        // Add debug logging
        console.log('Sending request to checkout endpoint...');
        
        const response = await fetch('/.netlify/functions/createCheckout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                bundle: 'BB'  // Remove account requirement
            })
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Raw server response:', responseText);

        // Validate response before parsing
        if (!responseText) {
            throw new Error('Empty response from server');
        }

        // Parse JSON response
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('JSON parse error:', e);
            throw new Error('Invalid response format');
        }

        if (!response.ok) {
            const errorMessage = data.error || 'Unknown error';
            console.error('Server error:', errorMessage);
            throw new Error(`Checkout failed: ${errorMessage}`);
        }

        if (!data.url) {
            throw new Error('No checkout URL in response');
        }

        console.log('Redirecting to checkout:', data.url);
        window.location.href = data.url;

    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed: ' + error.message);
    }
}