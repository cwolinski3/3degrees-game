import React, { useState, useEffect } from 'react';
// Import data using named exports.
import { questions as triviaQuestions } from './data/questions';
import { questions as educationQuestions } from './data/educationQuestions';

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
    if (userStr[i] === correctStr[i]) match++;
  }
  return (match / correctStr.length) >= 0.85;
}

// All available categories.
const allCategories = [
  "History", "Science", "Geography", "Math", "Literature", "Sports",
  "Music", "Art", "Technology", "Politics", "Movies", "Travel"
];

function App() {
  // --- Mode Selection (Home Screen) ---
  const [mode, setMode] = useState(null); // "trivia" or "education"

  // --- Pregame & Game State ---
  // gameState: "setup_p1_strength", "setup_p1_weakness", "playing"
  const [gameState, setGameState] = useState("setup_p1_strength");
  const [player1Strengths, setPlayer1Strengths] = useState([]);
  const [player1Weaknesses, setPlayer1Weaknesses] = useState([]);
  const [aiStrengths, setAiStrengths] = useState([]);
  const [aiWeaknesses, setAiWeaknesses] = useState([]);

  // --- In-game Variables ---
  const [turn, setTurn] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null); // Fixed for the current turn.
  const [degree, setDegree] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState({ "Player 1": 0, "AI Player": 0 });
  const [round, setRound] = useState(1);
  const [masteredCategories, setMasteredCategories] = useState({ "Player 1": [], "AI Player": [] });
  
  // --- Steal State (reserved for future extension) ---
  const [stealTurn, setStealTurn] = useState(null);

  // Active player is determined by turn parity (or stealTurn if active).
  const activePlayer = stealTurn ? stealTurn : (turn % 2 === 0 ? "Player 1" : "AI Player");

  // --- Data Source ---
  // Use educationQuestions if mode === "education", otherwise use triviaQuestions.
  const dataSource = mode === "education" ? educationQuestions : triviaQuestions;

  // --- Helper: Clear per-turn state ---
  const clearTurnState = () => {
    setSelectedCategory(null);
    setCurrentTopic(null);
    setDegree(1);
    setStealTurn(null);
  };

  // --- Reset Entire Game ---
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
      <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '20px' }}>
        <h1>3º Master of Knowledge</h1>
        <h2>Select Game Mode</h2>
        <button onClick={() => setMode("trivia")}>Trivia Mode</button>
        <button onClick={() => setMode("education")}>Education Mode</button>
      </div>
    );
  }

  // --- PREGAME: Strength Selection Screen ---
  if (gameState === "setup_p1_strength") {
    return (
      <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '20px' }}>
        <h1>3º Master of Knowledge - {mode === "education" ? "Education Mode" : "Trivia Mode"}</h1>
        <h2>Your Turn: Select 3 Strength Categories (for YOU)</h2>
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              if (player1Strengths.length < 3 && !player1Strengths.includes(cat)) {
                const newStr = [...player1Strengths, cat];
                setPlayer1Strengths(newStr);
                console.log("Selected Strengths:", newStr);
              }
            }}
          >
            {cat}
          </button>
        ))}
        <p>Your Strengths: {player1Strengths.join(", ")}</p>
      </div>
    );
  }

  // --- Auto-transition for Strength Selection ---
  useEffect(() => {
    if (gameState === "setup_p1_strength" && player1Strengths.length === 3) {
      setGameState("setup_p1_weakness");
      console.log("Transitioning to Weakness Selection");
    }
  }, [player1Strengths, gameState]);

  // --- PREGAME: Weakness Selection Screen ---
  if (gameState === "setup_p1_weakness") {
    return (
      <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '20px' }}>
        <h1>3º Master of Knowledge - {mode === "education" ? "Education Mode" : "Trivia Mode"}</h1>
        <h2>Your Turn: Select 3 Weakness Categories for AI</h2>
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              if (player1Weaknesses.length < 3 && !player1Weaknesses.includes(cat)) {
                const newWeak = [...player1Weaknesses, cat];
                setPlayer1Weaknesses(newWeak);
                console.log("Selected AI Weaknesses:", newWeak);
              }
            }}
          >
            {cat}
          </button>
        ))}
        <p>AI Weaknesses (your choices): {player1Weaknesses.join(", ")}</p>
      </div>
    );
  }

  // --- Auto-transition for Weakness Selection ---
  useEffect(() => {
    if (gameState === "setup_p1_weakness" && player1Weaknesses.length === 3) {
      console.log("Weakness selection complete:", player1Weaknesses);
      // AI randomly selects 3 strengths and 3 weaknesses (independently from all categories)
      const aiStr = [];
      const aiWeak = [];
      while (aiStr.length < 3) {
        const randCat = allCategories[Math.floor(Math.random() * allCategories.length)];
        if (!aiStr.includes(randCat)) aiStr.push(randCat);
      }
      while (aiWeak.length < 3) {
        const randCat = allCategories[Math.floor(Math.random() * allCategories.length)];
        if (!aiWeak.includes(randCat)) aiWeak.push(randCat);
      }
      console.log("AI Strengths:", aiStr, "AI Weaknesses:", aiWeak);
      setAiStrengths(aiStr);
      setAiWeaknesses(aiWeak);
      setGameState("playing");
      console.log("Transitioning to Gameplay");
    }
  }, [player1Weaknesses, gameState]);

  // --- GAMEPLAY: Determine available categories for active player ---
  let availableCategories = [];
  if (gameState === "playing") {
    if (activePlayer === "Player 1") {
      // For Player 1: available = (player1Strengths ∪ aiWeaknesses) minus categories already mastered by Player 1.
      availableCategories = [...player1Strengths, ...aiWeaknesses].filter(
        cat => !masteredCategories["Player 1"].includes(cat)
      );
    } else {
      // For AI: available = (aiStrengths ∪ player1Weaknesses) minus categories already mastered by AI.
      availableCategories = [...aiStrengths, ...player1Weaknesses].filter(
        cat => !masteredCategories["AI Player"].includes(cat)
      );
    }
    console.log("Available categories for", activePlayer, ":", availableCategories);
  }

  // --- Function: getQuestion ---
  const getQuestion = (deg) => {
    if (!currentTopic) return null;
    const qs = currentTopic.degrees?.[deg];
    return qs && qs.length > 0 ? qs[Math.floor(Math.random() * qs.length)] : null;
  };

  // --- useEffect: When currentTopic or degree changes, fetch a new question (with delay) ---
  useEffect(() => {
    if (gameState === "playing" && selectedCategory && currentTopic && degree) {
      const timer = setTimeout(() => {
        const q = getQuestion(degree);
        if (q) {
          setCurrentQuestion(q);
          console.log("New question fetched for degree", degree, ":", q);
        } else {
          setFeedback(`No questions available for "${currentTopic.topic}" at Degree ${degree}. Turn passes.`);
          clearTurnState();
          setTurn(prev => prev + 1);
        }
      }, 100); // 100ms delay
      return () => clearTimeout(timer);
    }
  }, [currentTopic, degree, selectedCategory, gameState]);

  // --- Function: handleSelectCategory ---
  const handleSelectCategory = (cat) => {
    clearTurnState();
    setSelectedCategory(cat);
    setDegree(1);
    const topics = dataSource[cat];
    if (!topics || topics.length === 0) {
      setFeedback(`No topics available for ${cat}. Please select another category.`);
      return;
    }
    const validTopics = topics.filter(topic => topic.degrees && topic.degrees[1] && topic.degrees[1].length > 0);
    if (validTopics.length === 0) {
      setFeedback(`No valid Degree 1 questions for ${cat}. Please select another category.`);
      return;
    }
    const chosenTopic = validTopics[Math.floor(Math.random() * validTopics.length)];
    const q = chosenTopic.degrees[1][Math.floor(Math.random() * chosenTopic.degrees[1].length)];
    setCurrentTopic(chosenTopic);
    setCurrentQuestion(q);
    setFeedback('');
    setAnswer('');
    console.log("Selected category:", cat, "Chosen topic:", chosenTopic.topic);
  };

  // --- Function: handleSubmitAnswer ---
  const handleSubmitAnswer = (providedAnswer) => {
    const userAnswer = providedAnswer !== undefined ? providedAnswer : answer;
    let isCorrect = false;
    if (activePlayer === "Player 1") {
      if (currentQuestion) {
        if (currentQuestion.type === "fill") {
          isCorrect = isAnswerAcceptable(
            userAnswer,
            Array.isArray(currentQuestion.answer)
              ? currentQuestion.answer[0]
              : currentQuestion.answer
          );
        } else {
          isCorrect = Array.isArray(currentQuestion.answer)
            ? currentQuestion.answer.some(a => a.trim().toLowerCase() === userAnswer.trim().toLowerCase())
            : userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
        }
      }
    } else {
      // Simulate AI correctness (70% chance)
      isCorrect = Math.random() < 0.7;
    }
    
    if (isCorrect) {
      let basePoints = degree * 10;
      if (currentQuestion.type === "fill") basePoints *= 2;
      const bonus = activePlayer === "Player 1"
        ? (player1Weaknesses.includes(selectedCategory) ? 10 : 0)
        : (aiWeaknesses.includes(selectedCategory) ? 10 : 0);
      const totalPoints = basePoints + bonus;
      setScore(prev => ({ ...prev, [activePlayer]: prev[activePlayer] + totalPoints }));
      if (degree < 3) {
        setDegree(prev => prev + 1);
      } else {
        setFeedback(`${activePlayer} has mastered ${selectedCategory} for topic "${currentTopic.topic}"!`);
        setMasteredCategories(prev => ({
          ...prev,
          [activePlayer]: [...prev[activePlayer], selectedCategory]
        }));
        clearTurnState();
        setTurn(prev => prev + 1);
        if (activePlayer === "AI Player") setRound(prev => prev + 1);
      }
    } else {
      setFeedback(`${activePlayer} answered incorrectly. Turn passes.`);
      clearTurnState();
      setTurn(prev => prev + 1);
      if (activePlayer === "AI Player") setRound(prev => prev + 1);
    }
    setAnswer('');
  };

  // --- Game Over ---
  if (gameState === "playing") {
    const totalCats = [...player1Strengths, ...aiWeaknesses].length;
    if (round > 5 || masteredCategories["Player 1"].length === totalCats) {
      const winner = score["Player 1"] > score["AI Player"] ? "Player 1" : "AI Player";
      const winReason = masteredCategories["Player 1"].length === totalCats ? "by Mastery" : "by Total Points Scored";
      return (
        <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '20px' }}>
          <h1>Game Over</h1>
          <h2>{winner} wins {winReason}!</h2>
          <p>Final Score - Player 1: {score["Player 1"]} | AI Player: {score["AI Player"]}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      );
    }
  }

  // --- Render Gameplay Interface ---
  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '20px' }}>
      <h1>3º Master of Knowledge - {mode === "education" ? "Education Mode" : "Trivia Mode"}</h1>
      {gameState === "playing" && (
        <>
          <h2>Round: {round} - {activePlayer}'s Turn</h2>
          {(!selectedCategory && activePlayer === "Player 1") && (
            <>
              <h3>Select a Category to Play:</h3>
              {availableCategories.map(cat => (
                <button key={cat} onClick={() => handleSelectCategory(cat)}>
                  {cat}
                </button>
              ))}
            </>
          )}
          {(!selectedCategory && activePlayer === "AI Player") && (
            <>
              <h3>AI is selecting a category...</h3>
              {availableCategories.length > 0 ? (
                <button onClick={() => handleSelectCategory(availableCategories[0])}>
                  AI selects {availableCategories[0]}
                </button>
              ) : (
                <p>No available categories for AI.</p>
              )}
            </>
          )}
          {selectedCategory && currentQuestion && (
            <>
              <h3>
                Category: {selectedCategory} - Topic: {currentTopic.topic} - Degree {degree}
              </h3>
              <p>{currentQuestion.question}</p>
              {activePlayer === "Player 1" ? (
                currentQuestion.type === "mc" ? (
                  <>
                    {currentQuestion.choices.map((choice, index) => (
                      <button key={index} onClick={() => handleSubmitAnswer(choice)}>
                        {choice}
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer"
                    />
                    <button onClick={() => handleSubmitAnswer()}>Submit Answer</button>
                  </>
                )
              ) : (
                <button onClick={() => handleSubmitAnswer()}>AI Answer</button>
              )}
              <p>{feedback}</p>
            </>
          )}
          <p>Score - Player 1: {score["Player 1"]} | AI Player: {score["AI Player"]}</p>
          <p>Mastered (Player 1): {masteredCategories["Player 1"].join(", ")}</p>
        </>
      )}
    </div>
  );
}

export default App;
