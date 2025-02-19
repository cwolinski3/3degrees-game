import React, { useState } from 'react';
import { questions } from './data/questions';

const allCategories = Object.keys(questions);

function App() {
  // Game states: setup for strengths, setup for weaknesses, playing, and gameOver.
  const [gameState, setGameState] = useState("setup_strength");
  const [player1Strengths, setPlayer1Strengths] = useState([]);
  const [player1Weaknesses, setPlayer1Weaknesses] = useState([]);
  const [aiStrengths, setAiStrengths] = useState([]);
  const [aiWeaknesses, setAiWeaknesses] = useState([]);
  const [turn, setTurn] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [degree, setDegree] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState({ "Player 1": 0, "AI Player": 0 });
  const [round, setRound] = useState(1);
  const [masteredCategories, setMasteredCategories] = useState({ "Player 1": [], "AI Player": [] });

  const currentPlayer = turn % 2 === 0 ? "Player 1" : "AI Player";

  // Pre-game: Player 1 selects strengths.
  const handleSelectStrength = (cat) => {
    if (player1Strengths.length < 3 && !player1Strengths.includes(cat)) {
      setPlayer1Strengths([...player1Strengths, cat]);
    }
    if (player1Strengths.length === 2 && !player1Strengths.includes(cat)) {
      // After selecting the 3rd, move to weakness selection.
      setGameState("setup_weakness");
    }
  };

  // Pre-game: Player 1 selects weaknesses for AI.
  const handleSelectWeakness = (cat) => {
    if (player1Weaknesses.length < 3 && !player1Weaknesses.includes(cat)) {
      setPlayer1Weaknesses([...player1Weaknesses, cat]);
    }
    if (player1Weaknesses.length === 2 && !player1Weaknesses.includes(cat)) {
      // After selecting 3 weaknesses, simulate AI selections:
      // For demo purposes, AI selects the first 3 categories not in player1Strengths.
      const remaining = allCategories.filter(c => !player1Strengths.includes(c));
      setAiStrengths(remaining.slice(0, 3));
      // And AI assigns 3 weaknesses for Player 1 from the next set.
      setAiWeaknesses(remaining.slice(3, 6));
      setGameState("playing");
    }
  };

  // In-game: Determine available categories for the current player.
  let availableCategories = [];
  if (gameState === "playing") {
    if (currentPlayer === "Player 1") {
      availableCategories = [...player1Strengths, ...aiWeaknesses].filter(cat => !masteredCategories["Player 1"].includes(cat));
    } else {
      availableCategories = [...aiStrengths, ...player1Weaknesses].filter(cat => !masteredCategories["AI Player"].includes(cat));
    }
  }

  // Get a random question from a category and degree.
  const getQuestion = (cat, deg) => {
    const qs = questions[cat].degrees[deg];
    if (qs && qs.length > 0) {
      return qs[Math.floor(Math.random() * qs.length)];
    }
    return null;
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setDegree(1);
    const q = getQuestion(cat, 1);
    setCurrentQuestion(q);
    setFeedback('');
    setAnswer('');
  };

  const handleSubmitAnswer = () => {
    // For Player 1, check the typed answer; for AI, simulate a 70% correct chance.
    let isCorrect = false;
    if (currentPlayer === "Player 1") {
      isCorrect = currentQuestion && (answer.trim().toLowerCase() === currentQuestion.answer.toLowerCase());
    } else {
      isCorrect = Math.random() < 0.7;
    }

    if (isCorrect) {
      setFeedback(`${currentPlayer} answered correctly!`);
      setScore(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + (degree * 10) }));
      if (degree < 3) {
        // Move to next degree in same category.
        const newDegree = degree + 1;
        setDegree(newDegree);
        const q = getQuestion(selectedCategory, newDegree);
        setCurrentQuestion(q);
      } else {
        // Category mastered.
        setFeedback(`${currentPlayer} has mastered ${selectedCategory}!`);
        setMasteredCategories(prev => ({
          ...prev,
          [currentPlayer]: [...prev[currentPlayer], selectedCategory]
        }));
        setSelectedCategory(null);
        setTurn(turn + 1);
        // Increment round after both players have played.
        if (currentPlayer === "AI Player") {
          setRound(round + 1);
        }
      }
    } else {
      setFeedback(`${currentPlayer} answered incorrectly! Turn passes.`);
      setSelectedCategory(null);
      setTurn(turn + 1);
      if (currentPlayer === "AI Player") {
        setRound(round + 1);
      }
    }
    setAnswer('');
  };

  // End game if 5 rounds have passed or if a player masters all their available categories.
  const totalCategoriesForPlayer = currentPlayer === "Player 1" ? [...player1Strengths, ...aiWeaknesses].length : [...aiStrengths, ...player1Weaknesses].length;
  if (round > 5 || masteredCategories["Player 1"].length === totalCategoriesForPlayer || masteredCategories["AI Player"].length === totalCategoriesForPlayer) {
    const winner = score["Player 1"] > score["AI Player"] ? "Player 1" : "AI Player";
    return (
      <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
        <h1>Game Over</h1>
        <h2>{winner} wins!</h2>
        <p>Final Score - Player 1: {score["Player 1"]} | AI Player: {score["AI Player"]}</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>3 Degrees Game</h1>
      {gameState === "setup_strength" && (
        <>
          <h2>Setup: Select Your 3 Strength Categories (Player 1)</h2>
          {allCategories.map(cat => (
            <button key={cat} onClick={() => handleSelectStrength(cat)} disabled={player1Strengths.includes(cat)}>
              {cat}
            </button>
          ))}
          <p>Your Strengths: {player1Strengths.join(", ")}</p>
          {player1Strengths.length >= 3 && <button onClick={() => setGameState("setup_weakness")}>Next: Select Weaknesses for AI</button>}
        </>
      )}
      {gameState === "setup_weakness" && (
        <>
          <h2>Setup: Select 3 Weaknesses for AI (from remaining categories)</h2>
          {allCategories.filter(cat => !player1Strengths.includes(cat)).map(cat => (
            <button key={cat} onClick={() => handleSelectWeakness(cat)} disabled={player1Weaknesses.includes(cat)}>
              {cat}
            </button>
          ))}
          <p>AI Weaknesses: {player1Weaknesses.join(", ")}</p>
        </>
      )}
      {gameState === "playing" && (
        <>
          <h2>Round: {round} - {currentPlayer}'s Turn</h2>
          {currentPlayer === "Player 1" && !selectedCategory && (
            <>
              <h3>Select a Category to Play (from your strengths and AI's weaknesses):</h3>
              {availableCategories.map(cat => (
                <button key={cat} onClick={() => handleSelectCategory(cat)}>{cat}</button>
              ))}
            </>
          )}
          {currentPlayer === "AI Player" && !selectedCategory && (
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
              <h3>Category: {selectedCategory} - Degree {degree}</h3>
              <p>{currentQuestion.question}</p>
              {currentPlayer === "Player 1" ? (
                <>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Your answer"
                  />
                  <button onClick={handleSubmitAnswer}>Submit Answer</button>
                </>
              ) : (
                <button onClick={handleSubmitAnswer}>AI Answer</button>
              )}
              <p>{feedback}</p>
            </>
          )}
          <p>Score - Player 1: {score["Player 1"]} | AI Player: {score["AI Player"]}</p>
          <p>Mastered Categories - Player 1: {masteredCategories["Player 1"].join(", ")}</p>
          <p>Mastered Categories - AI Player: {masteredCategories["AI Player"].join(", ")}</p>
        </>
      )}
    </div>
  );
}

export default App;
