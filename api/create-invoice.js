export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.BOT_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/createInvoiceLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Полный доступ к Inner Compass',
        description: 'Глубинный психологический портрет, архетип и персональный план восстановления',
        payload: 'inner_compass_pro_access',
        currency: 'XTR',
        prices: [{ label: 'Подписка PRO', amount: 250 }]
      })
    });

    const data = await response.json();
    if (!data.ok) {
      return res.status(400).json({ error: data.description });
    }

    return res.status(200).json({ invoiceLink: data.result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
