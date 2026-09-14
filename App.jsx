const handleBuyClick = async () => {
    setLoadingPayment(true);
    try {
      const res = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Сервер вернул не JSON: ' + text.slice(0, 100));
      }

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка HTTP: ' + res.status);
      }

      if (data.invoiceLink) {
        if (window.Telegram && window.Telegram.WebApp && typeof window.Telegram.WebApp.openInvoice === 'function') {
          window.Telegram.WebApp.openInvoice(data.invoiceLink, (status) => {
            if (status === 'paid') {
              setUnlocked(true);
              window.Telegram.WebApp.showAlert('Оплата прошла успешно! 🎉');
            }
          });
        } else {
          window.open(data.invoiceLink, '_blank');
        }
      } else {
        alert('Сервер не передал ссылку на оплату');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Сбой оплаты: ' + err.message);
    } finally {
      setLoadingPayment(false);
    }
  };
