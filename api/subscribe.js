export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { email } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  console.log('API Key starts with xkeysib:', apiKey.startsWith('xkeysib-'));
  console.log('First 10 chars:', apiKey.substring(0, 10));

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey.trim() // Trim any whitespace
      },
      body: JSON.stringify({
        email: email,
        listIds: [5], 
        updateEnabled: true
      })
    });
    
    const data = await response.json();
    
    console.log('Brevo response status:', response.status);
    console.log('Brevo response:', data);
    
    if (response.ok) {
      return res.status(200).json({ success: true, message: 'Subscribed successfully!' });
    } else {
      if (data.code === 'duplicate_parameter') {
        return res.status(200).json({ success: true, message: 'Already subscribed!' });
      }
      return res.status(400).json({ error: data.message || 'Subscription failed' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}