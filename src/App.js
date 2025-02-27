import React, { useState, useEffect } from 'react';
// Import all exports from the data files so we can reference the 'questions' object
import * as TriviaData from './data/questions';
import * as EducationData from './data/educationQuestions';

// Helper: returns true if the user's answer is at least 85% similar.
function isAnswerAcceptable(userAns, correctAns) {
  if (Array.isArray(correctAns)) {
    return correctAns.some(ans => isAnswerAcceptable(userAns, ans));
  }
  if (!isNaN(correctAns)) {
    return userAns.trim() === correctAns.toString();
  }
  const userStr = userAns.trim().toLowerCase();
  const correctStr = correctAns.trim().toLowerCase();
  let match = 0;
  for (let i = 0; i < Math.min(userStr.length, correctStr.length); i++) {
    if (userStr[i] === correctStr[i]) {
      match++;
    }
  }
  return (match / correctStr.length) >= 0.85;
}

const allCategories = [
  "History", "Science", "Geography", "Math", "Literature", "Sports",
  "Music", "Art", "Technology", "Politics", "Movies", "Travel"
];

function App() {
  // Mode selection state
  const [mode, setMode] = useState(null); // "trivia" or "education"

  // Game state variables
  const [gameState, setGameState] = useState("setup_p1_strength");
  const [player1Strengths, setPlayer1Strengths] = useState([]);
  const [player1Weaknesses, setPlayer1Weaknesses] = useState([]);
  const [aiStrengths, setAiStrengths] = useState([]);
  const [aiWeaknesses, setAiWeaknesses] = useState([]);
  const [turn, setTurn] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [degree, setDegree] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState({ "Player 1": 0, "AI Player": 0 });
  const [round, setRound] = useState(1);
  const [masteredCategories, setMasteredCategories] = useState({ "Player 1": [], "AI Player": [] });
  const [stealTurn, setStealTurn] = useState(null);

  // Active player: if a steal opportunity is active, use that; otherwise, determine by turn parity.
  const activePlayer = stealTurn ? stealTurn : (turn % 2 === 0 ? "Player 1" : "AI Player");

  // Choose data source based on mode.
  // If mode is "education", use EducationData.questions; otherwise, use TriviaData.questions.
  const dataSource = mode === "education" ? EducationData.questions : TriviaData.questions;
  console.log("Data Source:", dataSource);

  // Helper to clear per-turn state
  const clearTurnState = () => {
    setSelectedCategory(null);
    setCurrentTopic(null);
    setDegree(1);
    setStealTurn(null);
  };

  // Reset entire game
  const resetGame = () => {
    setGameState("setup_p1_strength");
    setPlayer1Strengths([]);
    setPlayer1Weaknesses([]);
    setAiStrengths([]);
    setAiWeaknesses([]);
    setTurn(0);
    clearTurnState();
    setCurrentQuestion(null);
    setAnswer('');
    setFeedback('');
    setScore({ "Player 1": 0, "AI Player": 0 });
    setRound(1);
    setMasteredCategories({ "Player 1": [], "AI Player": [] });
  };

  // --- MODE SELECTION SCREEN ---
  if (!mode) {
    return (
      <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
        <h1>3º Master of Knowledge</h1>
        <h2>Select Game Mode</h2>
        <button onClick={() => setMode("trivia")}>Trivia Mode</button>
        <button onClick={() => setMode("education")}>Education Mode</button>
      </div>
    );
  }

  // --- For now, show a minimal game screen to verify mode selection ---
  if (mode && gameState === "setup_p1_strength") {
    return (
      <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
        <h1>3º Master of Knowledge - {mode === "education" ? "Education Mode" : "Trivia Mode"}</h1>
        <h2>Setup: Select 3 Strength Categories</h2>
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setPlayer1Strengths(prev => [...prev, cat])}
            disabled={player1Strengths.includes(cat)}
          >
            {cat}
          </button>
        ))}
        <p>Your Strengths: {player1Strengths.join(", ")}</p>
        {player1Strengths.length >= 3 && (
          <button onClick={() => setGameState("setup_p1_weakness")}>Next: Select Weaknesses</button>
        )}
      </div>
    );
  }

  // (Further game logic would follow here once the mode selection and basic setup work)

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>3º Master of Knowledge - {mode === "education" ? "Education Mode" : "Trivia Mode"}</h1>
      <p>Game interface would go here...</p>
    </div>
  );
}

export default App;
