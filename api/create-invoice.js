export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.BOT_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendInvoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: userId,
        title: 'Полный доступ к Inner Compass',
        description: 'Глубинный психологический портрет, архетип и персональный план восстановления (250 Stars)',
        payload: 'inner_compass_pro_access',
        provider_token: '',
        currency: 'XTR',
        prices: [{ label: 'Доступ PRO', amount: 250 }]
      })
    });

    const data = await response.json();
    
    if (!data.ok) {
      console.error('Telegram API Error:', data);
      return res.status(400).json({ error: data.description || 'Telegram API error' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ error: error.message });
  }
}
