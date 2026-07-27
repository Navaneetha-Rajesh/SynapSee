import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  Trophy, 
  RotateCcw, 
  ArrowLeft, 
  Play,
  Volume2, 
  Image as ImageIcon, 
  Music, 
  Grid, 
  HelpCircle, 
  Flower2, 
  Smile, 
  Layers, 
  ListOrdered, 
  Clock
} from 'lucide-react';

const API_BASE = "http://localhost:3000";

export default function CognitiveGamesHub({ memories = [], onReturnToDashboard }) {
  const [activeGameId, setActiveGameId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [gameScore, setGameScore] = useState({ correct: 0, wrong: 0 });
  const [completed, setCompleted] = useState(false);
  const [logSaved, setLogSaved] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);

  // List of 5 Games (Keeping 1, 3, 4, 6, 7 renumbered to 1-5)
  const gamesList = [
    {
      id: "photo-recall",
      title: "1. Photo Recall Quiz",
      subtitle: "Who, Where, When",
      icon: ImageIcon,
      category: "Memory Recall",
      color: "bg-blue-500",
      description: "Look at a family photo and answer Who, Where, or When it took place."
    },
    {
      id: "sequencing",
      title: "2. Life Event Sequencing",
      subtitle: "Chronological Order",
      icon: ListOrdered,
      category: "Executive Function",
      color: "bg-amber-600",
      description: "Arrange 3 family memories in chronological order from past to present."
    },
    {
      id: "name-the-voice",
      title: "3. Name the Voice",
      subtitle: "Familiar Voices",
      icon: Volume2,
      category: "Auditory Recall",
      color: "bg-purple-600",
      description: "Listen to a voice recording and identify which loved one is speaking."
    },
    {
      id: "continue-song",
      title: "4. Continue the Song",
      subtitle: "Lullaby & Music",
      icon: Music,
      category: "Musical Memory",
      color: "bg-indigo-600",
      description: "Listen to a song snippet and select the correct next line of lyrics."
    },
    {
      id: "find-the-smile",
      title: "5. Find the Smile",
      subtitle: "Where's Waldo Style",
      icon: Smile,
      category: "Spatial Attention",
      color: "bg-emerald-600",
      description: "Tap directly on your family member in a group picture."
    }
  ];

  const startGame = async (gameId) => {
    setActiveGameId(gameId);
    setStartTime(new Date().toISOString());
    setGameScore({ correct: 0, wrong: 0 });
    setCompleted(false);
    setLogSaved(false);
    setGameData(null);

    const n8nGames = {
      "photo-recall": "photo-recall",
      "sequencing": "sequencing",
      "name-the-voice": "voice-recall",
      "continue-song": "song-completion"
    };

    if (n8nGames[gameId]) {
      setLoading(true);
      try {
        const gameType = n8nGames[gameId];
        const res = await fetch(`http://localhost:5678/webhook/generate-game-content?gameType=${gameType}`);
        const data = await res.json();
        setGameData(data);
      } catch (err) {
        console.error("Error fetching game data from n8n:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const finishGame = async (finalCorrect, finalWrong) => {
    setGameScore({ correct: finalCorrect, wrong: finalWrong });
    setCompleted(true);

    if (logSaved) return;
    setLogSaved(true);

    const now = new Date();
    const start = startTime ? new Date(startTime) : now;
    const duration = Math.max(1, Math.round((now.getTime() - start.getTime()) / 1000));

    const gameNames = {
      "photo-recall": "Photo Recall",
      "sequencing": "Life Event Sequencing",
      "name-the-voice": "Name the Voice",
      "continue-song": "Song Completion",
      "find-the-smile": "Find the Smile"
    };

    try {
      await fetch("http://localhost:5678/webhook/game-analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: "11111111-1111-1111-1111-111111111111",
          gameKey: activeGameId,
          gameName: gameNames[activeGameId] || activeGameId,
          score: finalCorrect,
          wrongCount: finalWrong,
          totalQuestions: finalCorrect + finalWrong,
          durationSeconds: duration
        })
      });
    } catch (e) {
      console.warn("Backend game log save offline:", e);
    }
  };

  return (
    <div className="flex-1 bg-skysoft flex flex-col p-6 max-w-6xl mx-auto w-full space-y-6 text-left">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-skyblue flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-navy p-3.5 rounded-2xl text-white shadow-md">
            <Brain className="h-8 w-8 text-skyblue" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-navy leading-tight">Cognitive Games Hub</h1>
            <p className="text-teal font-extrabold text-xs uppercase tracking-wider">Brain Exercise & Memory Reminiscence</p>
          </div>
        </div>
        {activeGameId ? (
          <button
            onClick={() => setActiveGameId(null)}
            className="bg-skyblue hover:bg-skyblue/80 text-navy font-black py-2.5 px-5 rounded-2xl border border-teal/20 transition flex items-center gap-2 text-sm cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Games Hub</span>
          </button>
        ) : (
          <button
            onClick={onReturnToDashboard}
            className="bg-skyblue hover:bg-skyblue/80 text-navy font-black py-2.5 px-5 rounded-2xl border border-teal/20 transition flex items-center gap-2 text-sm cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Senior Portal</span>
          </button>
        )}
      </div>

      {/* Main Area: Grid or Active Game */}
      {!activeGameId ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gamesList.slice(0, 5).map((g) => {
            const IconComp = g.icon;
            return (
              <div
                key={g.id}
                onClick={() => startGame(g.id)}
                className="bg-white rounded-3xl p-6 border-2 border-skyblue hover:border-teal shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-teal uppercase tracking-widest bg-skysoft px-3 py-1 rounded-full border border-skyblue">
                      {g.category}
                    </span>
                    <div className={`${g.color} text-white p-2.5 rounded-2xl shadow-sm`}>
                      <IconComp className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-navy leading-snug group-hover:text-teal transition">{g.title}</h3>
                    <p className="text-teal font-extrabold text-xs">{g.subtitle}</p>
                  </div>
                  <p className="text-navy/70 text-sm leading-relaxed">{g.description}</p>
                </div>

                <button className="w-full bg-navy group-hover:bg-teal text-white font-black py-3 px-4 rounded-2xl shadow transition flex items-center justify-center gap-2 text-sm cursor-pointer">
                  <Play className="h-4 w-4 fill-white" />
                  <span>Start Exercise</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border-2 border-teal shadow-xl space-y-8 min-h-[500px] flex flex-col justify-between">
          
          {/* Completion Celebration Modal */}
          {completed && (
            <div className="bg-skysoft border-4 border-teal p-8 rounded-3xl text-center space-y-6 animate-fade-in shadow-inner">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto animate-bounce" />
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-navy">Exercise Completed!</h2>
                <p className="text-teal font-bold text-lg">Your results have been synced to the Caregiver Dashboard.</p>
              </div>
              <div className="flex items-center justify-center gap-8 py-4">
                <div className="bg-white p-4 rounded-2xl border border-skyblue shadow-sm">
                  <span className="text-xs font-bold text-teal block uppercase">Correct</span>
                  <span className="text-3xl font-black text-teal">{gameScore.correct}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-skyblue shadow-sm">
                  <span className="text-xs font-bold text-teal block uppercase">Accuracy</span>
                  <span className="text-3xl font-black text-navy">
                    {Math.round((gameScore.correct / Math.max(1, gameScore.correct + gameScore.wrong)) * 100)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => startGame(activeGameId)}
                  className="bg-teal hover:bg-teal/90 text-white font-black py-3.5 px-6 rounded-2xl shadow transition flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Play Again</span>
                </button>
                <button
                  onClick={() => setActiveGameId(null)}
                  className="bg-navy hover:bg-navy/90 text-white font-black py-3.5 px-6 rounded-2xl shadow transition cursor-pointer"
                >
                  Back to Games Hub
                </button>
              </div>
            </div>
          )}

          {/* Active Game Containers */}
          {!completed && (
            <>
              {activeGameId === "photo-recall" && (
                loading ? <div className="text-center font-bold py-12">Loading memory questions...</div> :
                <PhotoRecallGame gameData={gameData} memories={memories} onComplete={finishGame} />
              )}
              {activeGameId === "sequencing" && (
                loading ? <div className="text-center font-bold py-12">Loading memory questions...</div> :
                <SequencingGame gameData={gameData} memories={memories} onComplete={finishGame} />
              )}
              {activeGameId === "name-the-voice" && (
                loading ? <div className="text-center font-bold py-12">Loading memory questions...</div> :
                <NameTheVoiceGame gameData={gameData} onComplete={finishGame} />
              )}
              {activeGameId === "continue-song" && (
                loading ? <div className="text-center font-bold py-12">Loading memory questions...</div> :
                <ContinueTheSongGame gameData={gameData} onComplete={finishGame} />
              )}
              {activeGameId === "find-the-smile" && (
                <FindTheSmileGame onComplete={finishGame} />
              )}
            </>
          )}

        </div>
      )}

    </div>
  );
}

function PhotoRecallGame({ gameData, memories, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(gameData);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [fetchingNext, setFetchingNext] = useState(false);

  // Sync initial gameData
  useEffect(() => {
    setCurrentQuestion(gameData);
    setQuestionsCount(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedLocation(null);
  }, [gameData]);

  const target = currentQuestion || memories[0] || { title: "Family Trip to Munnar", date: "2018", location: "Munnar", image_url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800" };
  const options = target.options || ["Munnar", "Sunset Beach", "Paris", "New York"];
  const question = target.question || "Where was this photo taken?";
  const imageUrl = target.photoUrl || target.image_url || (memories && memories[0]?.image_url);

  const handleAnswer = async (choice) => {
    setSelectedLocation(choice);
    const isCorrect = choice === target.correctAnswer || choice === target.location || choice === "Munnar";
    
    const newCorrect = correctCount + (isCorrect ? 1 : 0);
    const newWrong = wrongCount + (isCorrect ? 0 : 1);
    setCorrectCount(newCorrect);
    setWrongCount(newWrong);

    const nextCount = questionsCount + 1;
    setQuestionsCount(nextCount);

    setTimeout(async () => {
      if (nextCount < 3) {
        setFetchingNext(true);
        setSelectedLocation(null);
        try {
          const res = await fetch(`http://localhost:5678/webhook/generate-game-content?gameType=photo-recall`);
          const data = await res.json();
          setCurrentQuestion(data);
        } catch (err) {
          console.error("Error fetching next question:", err);
        } finally {
          setFetchingNext(false);
        }
      } else {
        onComplete(newCorrect, newWrong);
      }
    }, 1200);
  };

  if (fetchingNext) {
    return <div className="text-center font-bold py-12 text-navy">Loading next memory question...</div>;
  }

  return (
    <div className="space-y-6 text-center max-w-xl mx-auto">
      <div className="flex justify-between items-center text-xs font-black text-teal uppercase tracking-wider px-2">
        <span>Question {questionsCount + 1} of 3</span>
        <span>Score: {correctCount} / {questionsCount}</span>
      </div>
      <h3 className="text-2xl font-black text-navy">{question}</h3>
      {imageUrl && (
        <div className="aspect-[4/3] rounded-2xl overflow-hidden border-4 border-skyblue shadow-lg">
          <img src={imageUrl} alt="Recall memory" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={selectedLocation !== null}
            className={`py-4 px-6 rounded-2xl font-black text-lg shadow transition cursor-pointer border-2 ${
              selectedLocation === opt
                ? opt === target.correctAnswer || opt === target.location || opt === "Munnar" ? "bg-teal text-white border-teal" : "bg-alert text-white border-alert"
                : "bg-skysoft hover:bg-skyblue text-navy border-skyblue"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}



// ====================================================
// SUB-GAME 3: Life Event Sequencing
// ====================================================
function SequencingGame({ gameData, memories, onComplete }) {
  const defaultEvents = [
    { id: "e3", title: "Sunset Beach Trip (2012)" },
    { id: "e1", title: "Wedding Day (1975)" },
    { id: "e2", title: "Munnar Vacation (2018)" }
  ];
  const initial = gameData?.events || defaultEvents;
  const correctOrder = gameData?.correctOrderIds || gameData?.correctOrder || ["e1", "e3", "e2"];
  const [sequence, setSequence] = useState(initial);

  const moveUp = (idx) => {
    if (idx === 0) return;
    const arr = [...sequence];
    const temp = arr[idx - 1];
    arr[idx - 1] = arr[idx];
    arr[idx] = temp;
    setSequence(arr);
  };

  const verify = () => {
    const isCorrect = sequence.map(s => s.id).join(",") === correctOrder.join(",");
    onComplete(isCorrect ? 3 : 1, isCorrect ? 0 : 2);
  };

  return (
    <div className="space-y-6 text-center max-w-lg mx-auto">
      <h3 className="text-2xl font-black text-navy">Order Life Events (Earliest to Latest)</h3>
      <div className="space-y-3">
        {sequence.map((item, idx) => (
          <div key={item.id} className="bg-skysoft p-4 rounded-2xl border-2 border-skyblue flex items-center justify-between">
            <span className="font-black text-navy text-lg">{idx + 1}. {item.title}</span>
            {idx > 0 && (
              <button onClick={() => moveUp(idx)} className="bg-teal text-white px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer">
                Move Up ⬆️
              </button>
            )}
          </div>
        ))}
      </div>
      <button onClick={verify} className="w-full bg-navy text-white font-black py-4 rounded-2xl shadow-lg cursor-pointer text-lg">
        Submit Chronological Sequence
      </button>
    </div>
  );
}

// ====================================================
// SUB-GAME 4: Name the Voice
// ====================================================
function NameTheVoiceGame({ gameData, onComplete }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const defaultOptions = ["Grandson Leo", "Daughter Sarah", "Brother John", "Neighbor Paul"];
  const options = gameData?.options || defaultOptions;
  const question = gameData?.question || "Who is speaking in this recording?";
  const audioUrl = gameData?.audioUrl || "";

  const playAudio = () => {
    setPlaying(true);
    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
      }
      audioRef.current.play().catch(err => console.error("Audio play error:", err));
      audioRef.current.onended = () => setPlaying(false);
    } else {
      setTimeout(() => setPlaying(false), 3000);
    }
  };

  const handleChoice = (name) => {
    const isRight = gameData ? name === gameData.correctAnswer : name === "Grandson Leo";
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onComplete(isRight ? 1 : 0, isRight ? 0 : 1);
  };

  return (
    <div className="space-y-6 text-center max-w-md mx-auto">
      <h3 className="text-2xl font-black text-navy">{question}</h3>
      <button
        onClick={playAudio}
        className={`w-full py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 cursor-pointer shadow-lg ${
          playing ? "bg-alert text-white animate-pulse" : "bg-teal text-white hover:bg-navy"
        }`}
      >
        <Volume2 className="h-8 w-8" />
        <span>{playing ? "Playing Audio Clip..." : "Tap to Play Voice Clip"}</span>
      </button>
      <div className="grid grid-cols-2 gap-4">
        {options.map((name) => (
          <button
            key={name}
            onClick={() => handleChoice(name)}
            className="bg-skysoft hover:bg-skyblue border-2 border-skyblue text-navy font-black py-4 rounded-2xl text-md cursor-pointer"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

function ContinueTheSongGame({ gameData, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(gameData);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [fetchingNext, setFetchingNext] = useState(false);

  // Sync initial gameData
  useEffect(() => {
    setCurrentQuestion(gameData);
    setQuestionsCount(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedOption(null);
  }, [gameData]);

  const defaultOptions = [
    "You make me happy when skies are gray",
    "Twinkle twinkle little star",
    "Over the rainbow bluebirds fly"
  ];
  const options = currentQuestion?.options || defaultOptions;
  const promptLyrics = currentQuestion?.promptLyrics || "You make me happy when skies are grey...";
  const songTitle = currentQuestion?.songTitle || "Continue the Song";

  const handleChoice = async (choice) => {
    setSelectedOption(choice);
    const isCorrect = currentQuestion ? choice === currentQuestion.correctAnswer : choice === defaultOptions[0];
    
    const newCorrect = correctCount + (isCorrect ? 1 : 0);
    const newWrong = wrongCount + (isCorrect ? 0 : 1);
    setCorrectCount(newCorrect);
    setWrongCount(newWrong);

    const nextCount = questionsCount + 1;
    setQuestionsCount(nextCount);

    setTimeout(async () => {
      if (nextCount < 3) {
        setFetchingNext(true);
        setSelectedOption(null);
        try {
          const res = await fetch(`http://localhost:5678/webhook/generate-game-content?gameType=song-completion`);
          const data = await res.json();
          setCurrentQuestion(data);
        } catch (err) {
          console.error("Error fetching next song:", err);
        } finally {
          setFetchingNext(false);
        }
      } else {
        onComplete(newCorrect, newWrong);
      }
    }, 1200);
  };

  if (fetchingNext) {
    return <div className="text-center font-bold py-12 text-navy">Loading next song lyrics...</div>;
  }

  return (
    <div className="space-y-6 text-center max-w-lg mx-auto">
      <div className="flex justify-between items-center text-xs font-black text-teal uppercase tracking-wider px-2">
        <span>Song {questionsCount + 1} of 3</span>
        <span>Score: {correctCount} / {questionsCount}</span>
      </div>
      <h3 className="text-2xl font-black text-navy">{songTitle}</h3>
      <div className="bg-skysoft p-6 rounded-2xl border-2 border-skyblue italic font-bold text-lg text-navy">
        "{promptLyrics}"
      </div>
      <div className="space-y-3">
        {options.map((line) => (
          <button
            key={line}
            onClick={() => handleChoice(line)}
            disabled={selectedOption !== null}
            className={`w-full text-left font-black py-4 px-6 rounded-2xl text-md border-2 transition shadow cursor-pointer ${
              selectedOption === line
                ? line === (currentQuestion?.correctAnswer || defaultOptions[0]) ? "bg-teal text-white border-teal" : "bg-alert text-white border-alert"
                : "bg-white hover:bg-skyblue border-skyblue text-navy"
            }`}
          >
            {line}
          </button>
        ))}
      </div>
    </div>
  );
}

// ====================================================
// SUB-GAME 7: Find the Smile ("Where's Waldo")
// ====================================================
function FindTheSmileGame({ onComplete }) {
  const [tapped, setTapped] = useState(false);

  const handleImageTap = () => {
    setTapped(true);
    setTimeout(() => onComplete(1, 0), 1000);
  };

  return (
    <div className="space-y-6 text-center max-w-lg mx-auto">
      <h3 className="text-2xl font-black text-navy">Tap on your grandson Leo in the photo!</h3>
      <div onClick={handleImageTap} className="relative aspect-[4/3] rounded-2xl overflow-hidden border-4 border-teal cursor-pointer shadow-lg">
        <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800" alt="Family group" className="w-full h-full object-cover" />
        {tapped && (
          <div className="absolute top-1/3 left-1/2 border-4 border-teal bg-teal/30 h-20 w-20 rounded-full animate-ping" />
        )}
      </div>
      <p className="text-teal font-extrabold text-xs">Tap anywhere on the photo where you see Leo's face</p>
    </div>
  );
}




