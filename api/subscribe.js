export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.Test_API // We'll set this in Vercel
      },
      body: JSON.stringify({
        email: email,
        listIds: [5], 
        updateEnabled: true
      })
    });

    const data = await response.json();

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