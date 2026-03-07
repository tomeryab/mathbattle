import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { TOPICS } from "./questionGenerator";

const DIFFICULTY_LABELS = { easy: "קל", medium: "בינוני", hard: "קשה" };

export default function Results({ room, players, myPlayer }) {
  const navigate = useNavigate();
  const sorted = [...players].sort((a, b) => {
    if (b.correct_answers !== a.correct_answers) return b.correct_answers - a.correct_answers;
    const aTime = a.finish_time ? new Date(a.finish_time).getTime() : Infinity;
    const bTime = b.finish_time ? new Date(b.finish_time).getTime() : Infinity;
    return aTime - bTime;
  });

  const winner = sorted[0];
  const medals = ["🥇", "🥈", "🥉"];
  const isWinner = winner?.id === myPlayer?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Winner Banner */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-center mb-6"
        >
          <div className="text-6xl mb-3">{isWinner ? "🏆" : "🎮"}</div>
          <h1 className="text-3xl font-black text-white drop-shadow-lg">
            {isWinner ? "כל הכבוד! ניצחת! 🎉" : `המנצח: ${winner?.player_name}!`}
          </h1>
        </motion.div>

        {/* Leaderboard */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-4">
          <h2 className="text-lg font-black text-gray-700 mb-4 text-center">
            {TOPICS[room.topic]?.label} • {DIFFICULTY_LABELS[room.difficulty]}
          </h2>
          <div className="space-y-3">
            {sorted.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 ${p.id === myPlayer?.id ? "bg-indigo-50 border-2 border-indigo-300" : "bg-gray-50"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{i < 3 ? medals[i] : `${i + 1}.`}</span>
                  <div>
                    <div className="font-bold text-gray-800">{p.player_name}</div>
                    {p.finish_time && (
                      <div className="text-xs text-gray-400">סיים</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-600">{p.correct_answers}</div>
                  <div className="text-xs text-gray-400">תשובות נכונות</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => navigate(createPageUrl("Home"))}
          className="w-full h-12 text-lg bg-white text-indigo-600 font-bold hover:bg-white/90"
        >
          🏠 חזור לדף הבית
        </Button>
      </div>
    </div>
  );
}