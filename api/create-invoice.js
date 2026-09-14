export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.BOT_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  const userId = req.body?.userId;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/createInvoiceLink`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Полный доступ к Inner Compass',
          description:
            'Глубинный психологический портрет, архетип и персональный план восстановления',
          payload: `inner_compass_pro_access:${userId}`,
          currency: 'XTR',
          prices: [
            {
              label: 'Доступ PRO',
              amount: 250
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error('Telegram API Error:', data);

      return res.status(400).json({
        error: data?.description || 'Telegram API error'
      });
    }

    return res.status(200).json({
      success: true,
      invoiceLink: data.result
    });

  } catch (error) {
    console.error('Function error:', error);

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unknown server error'
    });
  }
}
