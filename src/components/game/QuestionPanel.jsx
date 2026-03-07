import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuestionPanel({ question, questionIndex, totalQuestions, onAnswer, myPlayer, players }) {
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setSelected(null);
    setAnswered(false);
    setTimeLeft(30);
  }, [questionIndex]);

  useEffect(() => {
    if (answered) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          if (!answered) handleAnswer(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [questionIndex, answered]);

  const handleAnswer = (option) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    onAnswer(option, timeLeft);
  };

  const isCorrect = selected === question.answer;
  const timePct = (timeLeft / 30) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col p-4" dir="rtl">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white/20 rounded-full px-4 py-2 text-white font-bold">
          שאלה {questionIndex + 1}/{totalQuestions}
        </div>
        <div className={`bg-white rounded-full px-5 py-2 font-black text-xl ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-indigo-600"}`}>
          ⏱ {timeLeft}
        </div>
      </div>

      {/* Timer Bar */}
      <div className="h-2 bg-white/30 rounded-full mb-6 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${timeLeft > 20 ? "bg-green-400" : timeLeft > 10 ? "bg-yellow-400" : "bg-red-400"}`}
          style={{ width: `${timePct}%` }}
        />
      </div>

      {/* Leaderboard mini */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[...players].sort((a, b) => b.score - a.score).slice(0, 5).map((p, i) => (
          <div key={p.id} className={`flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-white text-sm whitespace-nowrap ${p.id === myPlayer?.id ? "bg-white/40 font-bold" : ""}`}>
            <span>{["🥇", "🥈", "🥉", "4.", "5."][i]}</span>
            <span>{p.player_name}</span>
            <span className="opacity-70">{p.correct_answers}</span>
          </div>
        ))}
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={questionIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 mb-6 text-center"
          >
            <p className="text-2xl font-black text-gray-800 leading-relaxed" dir="ltr">{question.question}</p>
          </motion.div>
        </AnimatePresence>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((opt, i) => {
            let btnClass = "bg-white text-gray-800 hover:bg-indigo-50 border-2 border-white";
            if (answered) {
              if (opt === question.answer) btnClass = "bg-green-400 text-white border-green-400";
              else if (opt === selected) btnClass = "bg-red-400 text-white border-red-400";
              else btnClass = "bg-white/50 text-white/50 border-white/50";
            }
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(opt)}
                disabled={answered}
                className={`${btnClass} rounded-2xl p-5 text-xl font-black shadow-lg transition-all`}
                dir="ltr"
              >
                {opt}
              </motion.button>
            );
          })}
        </div>

        {/* Feedback */}
        {answered && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-4 text-center"
          >
            <div className={`inline-block rounded-full px-6 py-2 font-black text-lg ${isCorrect ? "bg-green-400 text-white" : "bg-white/30 text-white"}`}>
              {isCorrect ? "✅ נכון! כל הכבוד!" : `❌ הכי הפעם לא... התשובה הנכונה: ${question.answer}`}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}