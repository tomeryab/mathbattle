import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TOPICS } from "./questionGenerator";
import { Button } from "@/components/ui/button";
import { Users, Copy, CheckCircle } from "lucide-react";

const DIFFICULTY_LABELS = { easy: "קל 😊", medium: "בינוני 🤔", hard: "קשה 🔥" };

export default function Lobby({ room, players, myPlayer, onStart }) {
  const [copied, setCopied] = useState(false);
  const isHost = players[0]?.id === myPlayer?.id;

  const copyCode = () => {
    navigator.clipboard.writeText(room.room_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReady = async () => {
    await base44.entities.Player.update(myPlayer.id, { is_ready: true });
  };

  const handleStart = async () => {
    await base44.entities.GameRoom.update(room.id, {
      status: "playing",
      started_at: new Date().toISOString(),
    });
    onStart();
  };

  const allReady = players.length > 1 && players.every(p => p.is_ready);
  const myReady = myPlayer?.is_ready;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-5xl mb-4">🎮</div>
          <h2 className="text-2xl font-black text-gray-800 mb-1">חדר המתנה</h2>
          <p className="text-gray-500 mb-6">{TOPICS[room.topic]?.label} • {DIFFICULTY_LABELS[room.difficulty]}</p>

          {/* Room Code */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">קוד החדר</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-black tracking-widest text-indigo-600 font-mono">{room.room_code}</span>
              <button onClick={copyCode} className="text-indigo-400 hover:text-indigo-600 transition-colors">
                {copied ? <CheckCircle size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">שתף עם חברים כדי שיצטרפו</p>
          </div>

          {/* Players */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} className="text-gray-400" />
              <span className="text-sm font-bold text-gray-600">{players.length} שחקנים</span>
            </div>
            <div className="space-y-2">
              {players.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{["🦁", "🐯", "🦊", "🐺", "🦅", "🐬"][i % 6]}</span>
                    <span className="font-bold text-gray-700">{p.player_name}</span>
                    {i === 0 && <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">מארח</span>}
                  </div>
                  <span className={`text-sm font-bold ${p.is_ready ? "text-green-500" : "text-gray-300"}`}>
                    {p.is_ready ? "✓ מוכן" : "ממתין..."}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {!myReady ? (
            <Button onClick={handleReady} className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-emerald-400 font-bold">
              ✅ אני מוכן!
            </Button>
          ) : isHost && allReady ? (
            <Button onClick={handleStart} className="w-full h-12 text-lg bg-gradient-to-r from-indigo-500 to-purple-600 font-bold animate-pulse">
              🚀 התחל תחרות!
            </Button>
          ) : (
            <div className="text-center text-gray-400 font-medium py-3">
              {isHost ? "ממתין שכולם יהיו מוכנים..." : "ממתין שהמארח יתחיל..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}