import React, { useState } from 'react';

export default function App() {
  const [step, setStep] = useState('intro'); // 'intro', 'quiz', 'result'
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [unlocked, setUnlocked] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const questions = [
    {
      title: "Что сейчас сильнее всего истощает ваш внутренний ресурс?",
      options: [
        "Хроническая неопределенность и тревога за будущее",
        "Эмоциональное выгорание от рутины и обязательств",
        "Ощущение потери жизненного ориентира и смысла",
        "Конфликт между тем, что нужно делать, и тем, чего хочется"
      ]
    },
    {
      title: "Как вы обычно реагируете на сильный стресс?",
      options: [
        "Закрываюсь в себе и пытаюсь всё контролировать в одиночку",
        "Теряю продуктивность, прокрастинирую и чувствую усталость",
        "Пытаюсь всем угодить, забывая о собственных границах",
        "Испытываю всплески тревоги, переходящие в апатию"
      ]
    },
    {
      title: "Какой результат вы хотите получить от сегодняшнего погружения?",
      options: [
        "Четкое понимание текущей точки «А» и причин истощения",
        "Персональный компас для принятия сложных решений",
        "Практики быстрого восстановления ментального баланса",
        "Глубинный срез своего актуального психологического архетипа"
      ]
    }
  ];

  const handleAnswer = (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep('result');
    }
  };

  const handleBuyClick = async () => {
    setLoadingPayment(true);
    try {
      const res = await fetch('/api/create-invoice', { method: 'POST' });
      const data = await res.json();
      
      if (data.invoiceLink && window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openInvoice(data.invoiceLink, (status) => {
          if (status === 'paid') {
            setUnlocked(true);
            window.Telegram.WebApp.showAlert('Оплата прошла успешно! Полный анализ разблокирован 🎉');
          }
        });
      } else if (data.invoiceLink) {
        // Запасной вариант для тестирования в обычном браузере
        window.location.href = data.invoiceLink;
      } else {
        alert(data.error || 'Не удалось сформировать счет на оплату');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Произошла ошибка при создании счета.');
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md mx-auto flex flex-col flex-grow justify-center">
        
        {/* INTRO STEP */}
        {step === 'intro' && (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 mb-2 border border-indigo-500/30 shadow-inner">
              🧭
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Inner Compass</h1>
            <p className="text-slate-400 text-sm leading-relaxed px-2">
              Глубинный психологический навигатор. Узнайте свои скрытые блоки, текущий архетип и получите персональную карту восстановления баланса.
            </p>
            <button
              onClick={() => setStep('quiz')}
              className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition-all duration-200 active:scale-[0.98]"
            >
              Начать диагностику
            </button>
          </div>
        )}

        {/* QUIZ STEP */}
        {step === 'quiz' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-xs text-slate-400 uppercase tracking-wider">
              <span>Вопрос {currentQ + 1} из {questions.length}</span>
              <span>{Math.round(((currentQ + 1) / questions.length) * 100)}%</span>
            </div>
            
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            <h2 className="text-lg font-semibold text-white leading-snug">
              {questions[currentQ].title}
            </h2>

            <div className="space-y-3">
              {questions[currentQ].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className="w-full text-left p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-slate-200 text-sm transition-all duration-200 active:scale-[0.99]"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULT STEP */}
        {step === 'result' && (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Диагностика завершена
              </span>
              <h2 className="text-xl font-bold text-white">Ваш психологический срез</h2>
            </div>

            {/* Free / Preview Summary */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h3 className="text-sm font-semibold text-indigo-300">Базовый архетип: Странник</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Вы находитесь на этапе поиска новых опор. Текущий уровень стресса вызван перегрузкой адаптивных механизмов.
              </p>
            </div>

            {/* Locked Pro Content */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 p-4 space-y-3">
              {!unlocked && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    🔒
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Полный глубокий разбор PRO</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Индивидуальный план выхода из кризиса, триггеры и персональные практики (250 Stars / $4.99)
                    </p>
                  </div>
                  <button
                    onClick={handleBuyClick}
                    disabled={loadingPayment}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                  >
                    {loadingPayment ? 'Создание счета...' : 'Разблокировать за 250 ⭐ ($4.99)'}
                  </button>
                </div>
              )}

              <div className={!unlocked ? 'filter blur-sm select-none pointer-events-none space-y-3' : 'space-y-3'}>
                <h3 className="text-sm font-semibold text-emerald-400">✨ Глубинные рекомендации PRO</h3>
                <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                  <li>Точка уязвимости: склонность брать на себя чужую ответственность в периоды турбулентности.</li>
                  <li>Практика восстановления: «Заземление через тактильный ритм» (3 минуты ежедневно).</li>
                  <li>Стратегия на ближайшие 14 дней: снижение ментальной нагрузки за счет делегирования рутины.</li>
                </ul>
              </div>
            </div>

            {unlocked && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-300">
                🎉 Полный доступ успешно активирован! Все материалы разблокированы.
              </div>
            )}
          </div>
        )}

      </div>

      <footer className="w-full text-center text-[10px] text-slate-600 py-2">
        Inner Compass • Telegram Mini App
      </footer>
    </div>
  );
}
