async function verifyPurchase(sessionID. {
    try {
        const response = await fetch('/.netlify/functions/verify-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId })
        });

        const data = await response.json();
        
        if (data.success) {
            // Store the session ID for access verification
            localStorage.setItem('sessionId', sessionID.;
            
            // Store bundle purchase
            const purchases = JSON.parse(localStorage.getItem('purchases') || '{}');
            purchases[data.bundle] = true;
            localStorage.setItem('purchases', JSON.stringify(purchases));
            
            return true;
        }
        return false;
    } catch (error) {
        console.error('Verification failed:', error);
        return false;
    }
}