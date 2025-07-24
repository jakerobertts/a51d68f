async function handlePurchaseSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  
  if (!sessionId) {
    window.location.href = '/';
    return;
  }

  try {
    const response = await fetch('/.netlify/functions/verifyPurchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });

    const { bundles } = await response.json();
    
    // Store purchase info
    const purchases = JSON.parse(localStorage.getItem('purchases') || '{}');
    bundles.forEach(bundle => purchases[bundle] = true);
    localStorage.setItem('purchases', JSON.stringify(purchases));

    // Redirect back to content
    window.location.href = '/';
  } catch (err) {
    console.error('Error verifying purchase:', err);
    alert('There was an error processing your purchase. Please contact support.');
  }
}