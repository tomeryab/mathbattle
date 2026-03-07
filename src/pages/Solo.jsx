import { useState } from "react";
import { TOPICS, generateQuestions } from "../components/game/questionGenerator";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

const DIFFICULTY_LABELS = {
  easy: { label: "קל", emoji: "😊", color: "border-green-400 bg-green-50 text-green-700" },
  medium: { label: "בינוני", emoji: "🤔", color: "border-yellow-400 bg-yellow-50 text-yellow-700" },
  hard: { label: "קשה", emoji: "🔥", color: "border-red-400 bg-red-50 text-red-700" },
};

const TOPIC_CATEGORIES = [
  { name: "חיבור וחיסור", icon: "➕", topics: ["addition_subtraction_100","addition_subtraction_1000","addition_carrying","subtraction_borrowing"] },
  { name: "כפל וחילוק", icon: "✖️", topics: ["multiplication_table","multiplication_2digit","division_basic","multiplication_division_relation"] },
  { name: "מספרים", icon: "🔢", topics: ["place_value","number_comparison","rounding","even_odd"] },
  { name: "גאומטריה ומידות", icon: "📐", topics: ["perimeter","area_basic","time","money"] },
  { name: "שברים", icon: "½", topics: ["fractions_basic","fractions_comparison"] },
  { name: "בעיות מילוליות", icon: "🧩", topics: ["word_problems_1step","word_problems_2step"] },
];

export default function Solo() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("setup"); // setup | playing | results
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerRef, setTimerRef] = useState(null);

  const startGame = () => {
    const qs = generateQuestions(selectedTopic, selectedDifficulty);
    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setResults([]);
    setPhase("playing");
    startTimer();
  };

  const startTimer = () => {
    setTimeLeft(30);
    const ref = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(ref);
          handleAnswer(null, true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setTimerRef(ref);
  };

  const handleAnswer = (opt, timeout = false) => {
    if (answered) return;
    clearInterval(timerRef);
    setSelected(opt);
    setAnswered(true);

    const q = questions[currentIndex];
    const isCorrect = opt === q.answer;
    const newResults = [...results, { question: q.question, answer: q.answer, given: opt, correct: isCorrect }];
    setResults(newResults);
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        setPhase("results");
      } else {
        setCurrentIndex(i => i + 1);
        setSelected(null);
        setAnswered(false);
        startTimer();
      }
    }, 1200);
  };

  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-xl">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🎯</div>
            <h1 className="text-4xl font-black text-white drop-shadow-lg">תרגול סולו</h1>
            <p className="text-white/80 mt-1">תרגל בקצב שלך, ללא תחרות</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">דרגת קושי</label>
              <div className="flex gap-2">
                {Object.entries(DIFFICULTY_LABELS).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedDifficulty(key)}
                    className={`flex-1 py-2 px-3 rounded-xl border-2 font-bold text-sm transition-all ${selectedDifficulty === key ? val.color : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                  >
                    {val.emoji} {val.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">בחר נושא</label>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {TOPIC_CATEGORIES.map(cat => (
                  <div key={cat.name}>
                    <div className="text-xs font-bold text-gray-400 mb-1">{cat.icon} {cat.name}</div>
                    <div className="grid grid-cols-2 gap-1">
                      {cat.topics.map(topicKey => (
                        <button
                          key={topicKey}
                          onClick={() => setSelectedTopic(topicKey)}
                          className={`text-sm py-2 px-3 rounded-xl border-2 font-medium text-right transition-all ${selectedTopic === topicKey ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200 text-gray-600 hover:border-emerald-300"}`}
                        >
                          {TOPICS[topicKey]?.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={startGame}
              disabled={!selectedTopic}
              className="w-full h-12 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold"
            >
              🚀 התחל תרגול
            </Button>
            <button onClick={() => navigate(createPageUrl("Home"))} className="w-full text-center text-gray-400 hover:text-gray-600 text-sm">
              ← חזור לדף הבית
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "playing") {
    const q = questions[currentIndex];
    const timePct = (timeLeft / 30) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex flex-col p-4" dir="rtl">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/20 rounded-full px-4 py-2 text-white font-bold">
            שאלה {currentIndex + 1}/10
          </div>
          <div className={`bg-white rounded-full px-5 py-2 font-black text-xl ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-emerald-600"}`}>
            ⏱ {timeLeft}
          </div>
          <div className="bg-white/20 rounded-full px-4 py-2 text-white font-bold">
            ✅ {score}
          </div>
        </div>

        <div className="h-2 bg-white/30 rounded-full mb-6 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${timeLeft > 20 ? "bg-green-400" : timeLeft > 10 ? "bg-yellow-400" : "bg-red-400"}`}
            style={{ width: `${timePct}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 mb-6 text-center"
            >
              <p className="text-2xl font-black text-gray-800 leading-relaxed">{q.question}</p>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              let btnClass = "bg-white text-gray-800 hover:bg-emerald-50 border-2 border-white";
              if (answered) {
                if (opt === q.answer) btnClass = "bg-green-400 text-white border-green-400";
                else if (opt === selected) btnClass = "bg-red-400 text-white border-red-400";
                else btnClass = "bg-white/50 text-white/50 border-white/30";
              }
              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(opt)}
                  disabled={answered}
                  className={`${btnClass} rounded-2xl p-5 text-xl font-black shadow-lg transition-all`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {answered && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 text-center">
              <div className={`inline-block rounded-full px-6 py-2 font-black text-lg ${selected === q.answer ? "bg-green-400 text-white" : "bg-white/30 text-white"}`}>
                {selected === q.answer ? "✅ נכון!" : `❌ התשובה הנכונה: ${q.answer}`}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Results
  const pct = Math.round((score / 10) * 100);
  const emoji = pct === 100 ? "🏆" : pct >= 80 ? "⭐" : pct >= 60 ? "👍" : "💪";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-6">
          <div className="text-6xl mb-2">{emoji}</div>
          <h1 className="text-3xl font-black text-white drop-shadow-lg">סיימת!</h1>
          <p className="text-white/80 text-xl">{score}/10 תשובות נכונות</p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-4">
          {/* Score bar */}
          <div className="mb-5">
            <div className="flex justify-between text-sm font-bold text-gray-600 mb-1">
              <span>ציון</span><span>{pct}%</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${pct >= 80 ? "bg-green-400" : pct >= 60 ? "bg-yellow-400" : "bg-red-400"}`}
              />
            </div>
          </div>

          {/* Question review */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className={`flex items-start justify-between rounded-xl px-3 py-2 text-sm ${r.correct ? "bg-green-50" : "bg-red-50"}`}>
                <span className="text-gray-700 flex-1 ml-2">{r.question}</span>
                <span className={`font-bold whitespace-nowrap ${r.correct ? "text-green-600" : "text-red-500"}`}>
                  {r.correct ? `✅ ${r.answer}` : `❌ ${r.given ?? "לא ענית"} (${r.answer})`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={startGame} className="flex-1 h-12 bg-white text-emerald-600 font-bold hover:bg-white/90">
            🔄 שחק שוב
          </Button>
          <Button onClick={() => navigate(createPageUrl("Home"))} className="flex-1 h-12 bg-white/20 text-white font-bold hover:bg-white/30">
            🏠 בית
          </Button>
        </div>
      </div>
    </div>
  );
}