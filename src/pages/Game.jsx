import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import Lobby from "@/components/game/Lobby";
import QuestionPanel from "@/components/game/QuestionPanel";
import Results from "@/components/game/Results";

export default function Game() {
  const params = new URLSearchParams(window.location.search);
  const roomCode = params.get("room");
  const playerName = decodeURIComponent(params.get("player") || "");
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [myPlayer, setMyPlayer] = useState(null);
  const [phase, setPhase] = useState("lobby"); // lobby | playing | results
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const questionStartTime = useRef(Date.now());

  // Load room and my player
  useEffect(() => {
    if (!roomCode || !playerName) { navigate(createPageUrl("Home")); return; }
    loadData();
  }, []);

  const loadData = async () => {
    const rooms = await base44.entities.GameRoom.filter({ room_code: roomCode });
    if (!rooms.length) { navigate(createPageUrl("Home")); return; }
    setRoom(rooms[0]);

    const allPlayers = await base44.entities.Player.filter({ room_code: roomCode });
    setPlayers(allPlayers);
    const me = allPlayers.find(p => p.player_name === playerName);
    setMyPlayer(me);

    if (rooms[0].status === "playing") setPhase("playing");
    if (rooms[0].status === "finished") setPhase("results");
  };

  // Real-time subscriptions
  useEffect(() => {
    const unsub1 = base44.entities.GameRoom.subscribe((event) => {
      if (event.data?.room_code === roomCode) {
        setRoom(event.data);
        if (event.data.status === "playing") setPhase("playing");
        if (event.data.status === "finished") setPhase("results");
      }
    });
    const unsub2 = base44.entities.Player.subscribe((event) => {
      setPlayers(prev => {
        if (event.type === "create") return [...prev, event.data];
        if (event.type === "update") return prev.map(p => p.id === event.id ? event.data : p);
        if (event.type === "delete") return prev.filter(p => p.id !== event.id);
        return prev;
      });
      if (event.data?.player_name === playerName && event.data?.room_code === roomCode) {
        setMyPlayer(event.data);
      }
    });
    return () => { unsub1(); unsub2(); };
  }, [roomCode, playerName]);

  // Track question start time
  useEffect(() => {
    questionStartTime.current = Date.now();
  }, [currentQIndex]);

  const handleAnswer = async (answer, timeLeft) => {
    if (!myPlayer || !room) return;
    const question = room.questions[currentQIndex];
    const isCorrect = answer === question.answer;
    const timeTaken = 30000 - (timeLeft * 1000);

    const newAnswers = [...(myPlayer.answers || []), {
      question_index: currentQIndex,
      answer,
      is_correct: isCorrect,
      time_ms: timeTaken,
    }];

    const newCorrect = (myPlayer.correct_answers || 0) + (isCorrect ? 1 : 0);
    const isLastQuestion = currentQIndex === room.questions.length - 1;

    const updateData = {
      answers: newAnswers,
      correct_answers: newCorrect,
      score: newCorrect * 100,
      current_question_index: currentQIndex + 1,
    };

    if (isLastQuestion) {
      updateData.is_finished = true;
      updateData.finish_time = new Date().toISOString();
    }

    await base44.entities.Player.update(myPlayer.id, updateData);

    // Check if first to finish all correctly or just go next
    if (isLastQuestion) {
      // Check if all players finished
      const updatedPlayers = players.map(p => p.id === myPlayer.id ? { ...p, ...updateData } : p);
      const allDone = updatedPlayers.every(p => p.is_finished);
      if (allDone) {
        await base44.entities.GameRoom.update(room.id, {
          status: "finished",
          finished_at: new Date().toISOString(),
        });
      }
      setPhase("results");
    } else {
      // Move to next question after delay
      setTimeout(() => setCurrentQIndex(i => i + 1), 1200);
    }
  };

  if (!room || !myPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center" dir="rtl">
        <div className="text-white text-center">
          <div className="text-4xl mb-4 animate-bounce">🎮</div>
          <p className="text-xl font-bold">טוען...</p>
        </div>
      </div>
    );
  }

  if (phase === "lobby") {
    return <Lobby room={room} players={players} myPlayer={myPlayer} onStart={() => setPhase("playing")} />;
  }

  if (phase === "playing" && room.questions?.[currentQIndex]) {
    return (
      <QuestionPanel
        question={room.questions[currentQIndex]}
        questionIndex={currentQIndex}
        totalQuestions={room.questions.length}
        onAnswer={handleAnswer}
        myPlayer={myPlayer}
        players={players}
      />
    );
  }

  return <Results room={room} players={players} myPlayer={myPlayer} />;
}