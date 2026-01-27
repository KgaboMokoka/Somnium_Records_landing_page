document.getElementById('subscribe-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const email = document.getElementById('email-input').value 
    const button = e.target.querySelector('button');
    const message = document.getElementById('form-message'); 

    button.disable = true; 
    button.textContent = 'Subscribing'; 

    try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      message.textContent = data.message;
      message.className = 'mt-4 text-sm text-green-400';
      document.getElementById('email-input').value = '';
    } else {
      message.textContent = data.error || 'Something went wrong';
      message.className = 'mt-4 text-sm text-red-400';
    }
  } catch (error) {
    message.textContent = 'Network error. Please try again.';
    message.className = 'mt-4 text-sm text-red-400';
  } finally {
    button.disabled = false;
    button.textContent = 'Subscribe';
  }
}); 