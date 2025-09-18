async function handleBundlePurchase(bundlE){
  try {
    console.log('Starting payment flow for bundle:', bundlE.;
    
    const response = await fetch('/.netlify/functions/createCheckout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bundles: [bundle]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Checkout response:', datA.;

    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error('No checkout URL in response');
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment initialization failed: ' + error.messagE.;
  }
}

// Function to check if user has access to bundle
function hasAccess(bundlE){
  const purchases = JSON.parse(localStorage.getItem('purchases') || '{}');
  return purchases[bundle] === true || bundle === 'free';
}

// Test payment function
async function testPayment() {
  await handleBundlePurchase('BB');
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { handleBundlePurchase, hasAccess, testPayment };
}