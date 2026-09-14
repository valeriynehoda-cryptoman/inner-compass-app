import React, { useState } from 'react';

const QUESTIONS = [
  { id: 1, text: "Чем из того, что у вас есть, вы категорически не готовы жертвовать ни ради денег, ни ради отношений?" },
  { id: 2, text: "Какая ситуация или ошибка вызывает у вас наибольший внутренний стопор или тревогу?" },
  { id: 3, text: "Чем бы вы занялись, если бы имели абсолютную гарантию успеха и неограниченный бюджет?" },
  { id: 4, text: "Как реагирует ваша психика в момент сильного стресса (гиперконтроль, обесценивание, поиск выхода, уход в себя)?" },
  { id: 5, text: "Какое поведение или качество в других людях вызывает у вас наиболее резкое неприятие?" },
  { id: 6, text: "В какие моменты вам сложнее всего попросить о помощи или признать, что вы не справляетесь?" },
  { id: 7, text: "Какое базовое внутреннее состояние вы хотите чувствовать каждое утро?" }
];

export default function InnerCompassApp() {
  const [step, setStep] = useState('welcome'); // welcome | quiz | analyzing | portrait | paywall | dashboard
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Имитация сгенерированного ИИ-портрета
  const [portrait, setPortrait] = useState({
    summary: "Вы — прагматичный человек с мощным внутренним стержнем и высокой скоростью реакции. Ваша главная точка опоры — семья, а ключевой ресурс — стремление к масштабу и автономии.",
    drivers: ["Семья как эмоциональный центр", "Стремление к абсолютной свободе и масштабу", "Прагматичная автономия"],
    defenses: ["Мгновенный переход в действие (поиск выхода)", "Радикальное отсечение нарушителей границ"],
    growthAreas: ["Эмоциональная пауза перед включением режима 'решателя'", "Переход от контроля к глубокому релаксу"],
    dailyPractices: [
      { id: 1, title: "Пауза 3 минуты", desc: "При возникновении стресса сделать 5 глубоких вдохов перед тем, как искать выход.", done: false },
      { id: 2, title: "Микро-просьба", desc: "Попросить близких о мелкой помощи, которую можете сделать сами.", done: false }
    ]
  });

  const handleNextQuestion = () => {
    if (!currentAnswer.trim()) return;
    const updated = { ...answers, [QUESTIONS[currentQ].id]: currentAnswer };
    setAnswers(updated);
    setCurrentAnswer('');

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep('analyzing');
      setTimeout(() => setStep('portrait'), 2500); // Имитация генерации через ИИ
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        
        {/* Хедер */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-3">
          <span className="font-bold text-lg tracking-wider text-emerald-400">INNER COMPASS</span>
          {isSubscribed && <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">PRO</span>}
        </div>

        {/* 1. ЭКРАН ПРИВЕТСТВИЯ */}
        {step === 'welcome' && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-2xl">
              🧭
            </div>
            <h1 className="text-2xl font-bold">Раскройте свой психологический код</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ответьте на 7 глубинных вопросов, чтобы получить ИИ-анализ ваших защитных механизмов, драйверов и индивидуальный план развития.
            </p>
            <button 
              onClick={() => setStep('quiz')} 
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl transition shadow-lg shadow-emerald-500/20">
              Начать экспресс-диагностику
            </button>
          </div>
        )}

        {/* 2. ЭКРАН ОПРОСА */}
        {step === 'quiz' && (
          <div className="space-y-5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Вопрос {currentQ + 1} из {QUESTIONS.length}</span>
              <span>{Math.round(((currentQ + 1) / QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-400 h-full transition-all duration-300" 
                style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}></div>
            </div>

            <h2 className="text-lg font-medium text-slate-100 min-h-[60px]">
              {QUESTIONS[currentQ].text}
            </h2>

            <textarea
              rows={4}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Введите ваш искренний ответ..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition resize-none"
            />

            <button
              onClick={handleNextQuestion}
              disabled={!currentAnswer.trim()}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-xl transition">
              {currentQ === QUESTIONS.length - 1 ? "Сформировать портрет" : "Следующий вопрос"}
            </button>
          </div>
        )}

        {/* 3. ЭКРАН ГЕНЕРАЦИИ */}
        {step === 'analyzing' && (
          <div className="text-center py-12 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mx-auto"></div>
            <h3 className="text-lg font-medium">Нейросеть анализирует ваши ответы...</h3>
            <p className="text-xs text-slate-400">Сопоставление защитных механизмов и поиск ключевых точек роста</p>
          </div>
        )}

        {/* 4. БЕСПЛАТНЫЙ ПОРТРЕТ */}
        {step === 'portrait' && (
          <div className="space-y-5 text-sm">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
              <h3 className="text-emerald-400 font-semibold mb-1">Ваш базовый профиль</h3>
              <p className="text-slate-300 text-xs leading-relaxed">{portrait.summary}</p>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Главные драйверы</h4>
                <div className="flex flex-wrap gap-1.5">
                  {portrait.drivers.map((d, i) => (
                    <span key={i} className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg">{d}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Защитные механизмы</h4>
                <div className="flex flex-wrap gap-1.5">
                  {portrait.defenses.map((def, i) => (
                    <span key={i} className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs px-2.5 py-1 rounded-lg">{def}</span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('paywall')}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-500/20">
              Перейти к проработке зон роста →
            </button>
          </div>
        )}

        {/* 5. ЭКРАН PAYWALL */}
        {step === 'paywall' && (
          <div className="space-y-5 text-center py-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              INNER COMPASS PRO
            </span>
            <h2 className="text-xl font-bold">Начните управляемую трансформацию</h2>
            
            <div className="text-left space-y-2.5 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Ежедневные 2-минутные трекинг-практики</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>ИИ-Коуч 24/7 для разбора стрессовых ситуаций</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Ежемесячный пересчет психологического профиля</span>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl text-left">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-sm text-emerald-300">3 дня бесплатно</div>
                  <div className="text-[11px] text-slate-400">затем $4.99 / неделю</div>
                </div>
                <span className="text-xs bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded">ВЫГОДНО</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSubscribed(true);
                setStep('dashboard');
              }}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-500/20">
              Активировать 3 дня бесплатно
            </button>
            <p className="text-[10px] text-slate-500">Отмена в один клик в любой момент.</p>
          </div>
        )}

        {/* 6. ПЛАТНЫЙ ДАШБОРД */}
        {step === 'dashboard' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-200">Практики на сегодня</h3>
              <span className="text-xs text-slate-400">Цель: Релакс и Границы</span>
            </div>

            <div className="space-y-3">
              {portrait.dailyPractices.map((p) => (
                <div key={p.id} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-emerald-400">{p.title}</span>
                    <input type="checkbox" className="accent-emerald-500 w-4 h-4 rounded cursor-pointer" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex justify-between items-center">
              <div>
                <div className="text-xs font-semibold">ИИ-Коуч 24/7</div>
                <div className="text-[11px] text-slate-400">Разбрать ситуацию или обесценивание</div>
              </div>
              <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-emerald-400 font-medium rounded-lg transition">
                Чат
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
