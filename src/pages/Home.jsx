import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { TOPICS, generateQuestions } from "../components/game/questionGenerator";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Zap, BookOpen } from "lucide-react";

const DIFFICULTY_LABELS = {
  easy: { label: "קל", color: "bg-green-100 text-green-700 border-green-300", emoji: "😊" },
  medium: { label: "בינוני", color: "bg-yellow-100 text-yellow-700 border-yellow-300", emoji: "🤔" },
  hard: { label: "קשה", color: "bg-red-100 text-red-700 border-red-300", emoji: "🔥" },
};

const TOPIC_CATEGORIES = [
  {
    name: "חיבור וחיסור",
    icon: "➕",
    topics: ["addition_subtraction_100", "addition_subtraction_1000", "addition_carrying", "subtraction_borrowing"],
  },
  {
    name: "כפל וחילוק",
    icon: "✖️",
    topics: ["multiplication_table", "multiplication_2digit", "division_basic", "multiplication_division_relation"],
  },
  {
    name: "מספרים",
    icon: "🔢",
    topics: ["place_value", "number_comparison", "rounding", "even_odd"],
  },
  {
    name: "גאומטריה ומידות",
    icon: "📐",
    topics: ["perimeter", "area_basic", "time", "money"],
  },
  {
    name: "שברים",
    icon: "½",
    topics: ["fractions_basic", "fractions_comparison"],
  },
  {
    name: "בעיות מילוליות",
    icon: "🧩",
    topics: ["word_problems_1step", "word_problems_2step"],
  },
];

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

export default function Home() {
  const [playerName, setPlayerName] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [joinCode, setJoinCode] = useState("");
  const [mode, setMode] = useState("home"); // home | create | join
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!playerName.trim() || !selectedTopic) return;
    setLoading(true);
    const roomCode = generateRoomCode();
    const questions = generateQuestions(selectedTopic, selectedDifficulty);
    const room = await base44.entities.GameRoom.create({
      room_code: roomCode,
      topic: selectedTopic,
      difficulty: selectedDifficulty,
      questions,
      status: "waiting",
      current_question_index: 0,
    });
    await base44.entities.Player.create({
      room_code: roomCode,
      player_name: playerName.trim(),
      score: 0,
      correct_answers: 0,
      current_question_index: 0,
      is_ready: false,
      is_finished: false,
      answers: [],
    });
    navigate(createPageUrl(`Game?room=${roomCode}&player=${encodeURIComponent(playerName.trim())}`));
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim() || !joinCode.trim()) return;
    setLoading(true);
    const rooms = await base44.entities.GameRoom.filter({ room_code: joinCode.toUpperCase() });
    if (!rooms.length || rooms[0].status === "finished") {
      alert("חדר לא נמצא או שהמשחק כבר הסתיים");
      setLoading(false);
      return;
    }
    await base44.entities.Player.create({
      room_code: joinCode.toUpperCase(),
      player_name: playerName.trim(),
      score: 0,
      correct_answers: 0,
      current_question_index: 0,
      is_ready: false,
      is_finished: false,
      answers: [],
    });
    navigate(createPageUrl(`Game?room=${joinCode.toUpperCase()}&player=${encodeURIComponent(playerName.trim())}`));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🏆</div>
          <h1 className="text-5xl font-black text-white mb-2 drop-shadow-lg">MathBattle</h1>
          <p className="text-white/80 text-xl">משחק חשבון תחרותי לכיתה ג'</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {mode === "home" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setMode("create")}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform"
                >
                  <Trophy size={36} />
                  <span>צור חדר חדש</span>
                  <span className="text-sm font-normal opacity-80">התחל תחרות</span>
                </button>
                <button
                  onClick={() => setMode("join")}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform"
                >
                  <Users size={36} />
                  <span>הצטרף לחדר</span>
                  <span className="text-sm font-normal opacity-80">הזן קוד חדר</span>
                </button>
              </div>
              <div className="flex gap-3 mt-2">
                <div className="flex-1 bg-indigo-50 rounded-xl p-4 flex items-center gap-3">
                  <Zap className="text-indigo-500" size={24} />
                  <div>
                    <div className="font-bold text-indigo-700">10 שאלות</div>
                    <div className="text-sm text-indigo-500">לכל תחרות</div>
                  </div>
                </div>
                <div className="flex-1 bg-pink-50 rounded-xl p-4 flex items-center gap-3">
                  <BookOpen className="text-pink-500" size={24} />
                  <div>
                    <div className="font-bold text-pink-700">20 נושאים</div>
                    <div className="text-sm text-pink-500">לבחירה</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mode === "create" && (
            <div className="space-y-5">
              <button onClick={() => setMode("home")} className="text-gray-400 hover:text-gray-600 text-sm">← חזור</button>
              <h2 className="text-2xl font-black text-gray-800">צור חדר חדש 🎮</h2>

              <Input
                placeholder="שם השחקן שלך"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                className="text-lg h-12 text-right"
                dir="rtl"
              />

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">דרגת קושי</label>
                <div className="flex gap-2">
                  {Object.entries(DIFFICULTY_LABELS).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedDifficulty(key)}
                      className={`flex-1 py-2 px-3 rounded-xl border-2 font-bold text-sm transition-all ${selectedDifficulty === key ? val.color + " border-current" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                    >
                      {val.emoji} {val.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">בחר נושא</label>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {TOPIC_CATEGORIES.map(cat => (
                    <div key={cat.name}>
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1">{cat.icon} {cat.name}</div>
                      <div className="grid grid-cols-2 gap-1">
                        {cat.topics.map(topicKey => (
                          <button
                            key={topicKey}
                            onClick={() => setSelectedTopic(topicKey)}
                            className={`text-sm py-2 px-3 rounded-xl border-2 font-medium text-right transition-all ${selectedTopic === topicKey ? "bg-indigo-500 text-white border-indigo-500" : "border-gray-200 text-gray-600 hover:border-indigo-300"}`}
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
                onClick={handleCreateRoom}
                disabled={!playerName.trim() || !selectedTopic || loading}
                className="w-full h-12 text-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-bold"
              >
                {loading ? "יוצר..." : "🚀 צור חדר"}
              </Button>
            </div>
          )}

          {mode === "join" && (
            <div className="space-y-5">
              <button onClick={() => setMode("home")} className="text-gray-400 hover:text-gray-600 text-sm">← חזור</button>
              <h2 className="text-2xl font-black text-gray-800">הצטרף לתחרות 🎯</h2>
              <Input
                placeholder="שם השחקן שלך"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                className="text-lg h-12 text-right"
                dir="rtl"
              />
              <Input
                placeholder="קוד החדר (5 תווים)"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                className="text-lg h-12 text-center tracking-widest font-mono"
                maxLength={5}
              />
              <Button
                onClick={handleJoinRoom}
                disabled={!playerName.trim() || joinCode.length < 4 || loading}
                className="w-full h-12 text-lg bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 font-bold"
              >
                {loading ? "מצטרף..." : "🎮 הצטרף"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}