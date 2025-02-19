import React, { useState } from 'react';
import { questions } from './data/questions';

// Helper function for answer tolerance (85% letter match for text answers)
function isAnswerAcceptable(userAns, correctAns) {
  // For numeric answers, require exact match
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
  const ratio = match / correctStr.length;
  return ratio >= 0.85;
}

// All 12 categories – for demo, you can add more if needed.
const allCategories = [
  "History", "Science", "Geography", "Math", "Literature", "Sports",
  "Music", "Art", "Technology", "Politics", "Movies", "Travel"
];

function App() {
  // Game phases:
  // "setup_p1_strength" - Player 1 selects 3 strengths.
  // "setup_p1_weakness" - Player 1 assigns 3 weaknesses for AI.
  // "setup_ai" - AI selects its 3 strengths and assigns 3 weaknesses for Player 1.
  // "playing" - Game play begins.
  const [gameState, setGameState] = useState("setup_p1_strength");
  const [player1Strengths, setPlayer1Strengths] = useState([]);
  const [player1Weaknesses, setPlayer1Weaknesses] = useState([]);
  const [aiStrengths, setAiStrengths] = useState([]);
  const [aiWeaknesses, setAiWeaknesses] = useState([]);
  
  // In-game state
  const [turn, setTurn] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [degree, setDegree] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState({ "Player 1": 0, "AI Player": 0 });
  const [round, setRound] = useState(1);
  const [masteredCategories, setMasteredCategories] = useState({ "Player 1": [], "AI Player": [] });

  // Determine current player (Player 1 on even turns, AI on odd turns)
  const currentPlayer = turn % 2 === 0 ? "Player 1" : "AI Player";

  // ----------------------------
  // Pre-game Setup: Player 1 Strengths Selection
  // ----------------------------
  const handleP1SelectStrength = (cat) => {
    if (player1Strengths.length < 3 && !player1Strengths.includes(cat)) {
      setPlayer1Strengths([...player1Strengths, cat]);
    }
    // When exactly 3 are selected, move to weakness selection for AI.
    if (player1Strengths.length === 2 && !player1Strengths.includes(cat)) {
      const newStrengths = [...player1Strengths, cat];
      setPlayer1Strengths(newStrengths);
      setGameState("setup_p1_weakness");
    }
  };

  // ----------------------------
  // Pre-game Setup: Player 1 assigns weaknesses for AI.
  // ----------------------------
  const handleP1SelectWeakness = (cat) => {
    if (player1Weaknesses.length < 3 && !player1Weaknesses.includes(cat)) {
      setPlayer1Weaknesses([...player1Weaknesses, cat]);
    }
    // When 3 weaknesses are selected, move to AI setup.
    if (player1Weaknesses.length === 2 && !player1Weaknesses.includes(cat)) {
      const newWeaknesses = [...player1Weaknesses, cat];
      setPlayer1Weaknesses(newWeaknesses);
      setGameState("setup_ai");
    }
  };

  // ----------------------------
  // Pre-game Setup: AI selects strengths and assigns weaknesses for Player 1.
  // For demo purposes, we auto-select from remaining categories.
  // ----------------------------
  if (gameState === "setup_ai") {
    const remaining = allCategories.filter(cat => !player1Strengths.includes(cat));
    // Auto-select first 3 as AI strengths.
    if (aiStrengths.length === 0) {
      setAiStrengths(remaining.slice(0, 3));
    }
    // Auto-select next 3 as AI weaknesses (for Player 1).
    if (aiWeaknesses.length === 0) {
      setAiWeaknesses(remaining.slice(3, 6));
    }
    // Transition to playing state.
    if (aiStrengths.length === 3 && aiWeaknesses.length === 3) {
      setGameState("playing");
    }
  }

  // ----------------------------
  // In-game: Determine available categories.
  // For Player 1: union of (player1Strengths) and (aiWeaknesses)
  // For AI: union of (aiStrengths) and (player1Weaknesses)
  // ----------------------------
  let availableCategories = [];
  if (gameState === "playing") {
    if (currentPlayer === "Player 1") {
      availableCategories = [...player1Strengths, ...aiWeaknesses].filter(
        cat => !masteredCategories["Player 1"].includes(cat)
      );
    } else {
      availableCategories = [...aiStrengths, ...player1Weaknesses].filter(
        cat => !masteredCategories["AI Player"].includes(cat)
      );
    }
  }

  // ----------------------------
  // Function to get a random question from a category and degree.
  // ----------------------------
  const getQuestion = (cat, deg) => {
    const qs = questions[cat].degrees[deg];
    return qs && qs.length > 0 ? qs[Math.floor(Math.random() * qs.length)] : null;
  };

  // ----------------------------
  // When a category is selected, start the question progression.
  // ----------------------------
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setDegree(1);
    const q = getQuestion(cat, 1);
    setCurrentQuestion(q);
    setFeedback('');
    setAnswer('');
  };

  // ----------------------------
  // Answer submission and steal mechanism.
  // ----------------------------
  const handleSubmitAnswer = () => {
    let isCorrect = false;
    if (currentPlayer === "Player 1") {
      if (currentQuestion) {
        isCorrect = isAnswerAcceptable(
          answer,
          Array.isArray(currentQuestion.answer) ? currentQuestion.answer[0] : currentQuestion.answer
        );
      }
    } else {
      // For AI, simulate a correct answer with 70% probability.
      isCorrect = Math.random() < 0.7;
    }

    if (isCorrect) {
      setFeedback(`${currentPlayer} answered correctly!`);
      let basePoints = degree * 10;
      // Bonus: if the answered category is a weakness for the current player, add extra bonus.
      if (currentPlayer === "Player 1") {
        if (aiWeaknesses.includes(selectedCategory)) {
          basePoints += 20;
        } else if (player1Strengths.includes(selectedCategory)) {
          basePoints += 10;
        }
      } else {
        if (player1Weaknesses.includes(selectedCategory)) {
          basePoints += 20;
        } else if (aiStrengths.includes(selectedCategory)) {
          basePoints += 10;
        }
      }
      setScore(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + basePoints }));

      if (degree < 3) {
        const newDegree = degree + 1;
        setDegree(newDegree);
        const q = getQuestion(selectedCategory, newDegree);
        setCurrentQuestion(q);
      } else {
        setFeedback(`${currentPlayer} has mastered ${selectedCategory}!`);
        setMasteredCategories(prev => ({
          ...prev,
          [currentPlayer]: [...prev[currentPlayer], selectedCategory]
        }));
        setSelectedCategory(null);
        setTurn(turn + 1);
        if (currentPlayer === "AI Player") setRound(round + 1);
      }
    } else {
      // Steal mechanism: Opponent gets a chance with 60% probability.
      const opponent = currentPlayer === "Player 1" ? "AI Player" : "Player 1";
      if (Math.random() < 0.6) {
        setFeedback(`${opponent} steals the question!`);
        let stealPoints = degree * 10;
        if (opponent === "Player 1") {
          if (aiWeaknesses.includes(selectedCategory)) {
            stealPoints += 20;
          } else if (player1Strengths.includes(selectedCategory)) {
            stealPoints += 10;
          }
        } else {
          if (player1Weaknesses.includes(selectedCategory)) {
            stealPoints += 20;
          } else if (aiStrengths.includes(selectedCategory)) {
            stealPoints += 10;
          }
        }
        setScore(prev => ({ ...prev, [opponent]: prev[opponent] + stealPoints }));
        if (degree < 3) {
          const newDegree = degree + 1;
          setDegree(newDegree);
          const q = getQuestion(selectedCategory, newDegree);
          setCurrentQuestion(q);
        } else {
          setFeedback(`${opponent} has mastered ${selectedCategory} by stealing!`);
          setMasteredCategories(prev => ({
            ...prev,
            [opponent]: [...prev[opponent], selectedCategory]
          }));
          setSelectedCategory(null);
          setTurn(turn + 1);
          if (opponent === "AI Player") setRound(round + 1);
        }
      } else {
        setFeedback(`${currentPlayer} answered incorrectly! Turn passes.`);
        setSelectedCategory(null);
        setTurn(turn + 1);
        if (currentPlayer === "AI Player") setRound(round + 1);
      }
    }
    setAnswer('');
  };

  // ----------------------------
  // Game Over Condition: Check only when gameState is "playing".
  // ----------------------------
  if (gameState === "playing") {
    const totalCategoriesForPlayer =
      currentPlayer === "Player 1"
        ? [...player1Strengths, ...aiWeaknesses].length
        : [...aiStrengths, ...player1Weaknesses].length;

    if (
      round > 5 ||
      masteredCategories["Player 1"].length === totalCategoriesForPlayer ||
      masteredCategories["AI Player"].length === totalCategoriesForPlayer
    ) {
      const winner = score["Player 1"] > score["AI Player"] ? "Player 1" : "AI Player";
      return (
        <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
          <h1>Game Over</h1>
          <h2>{winner} wins!</h2>
          <p>Final Score - Player 1: {score["Player 1"]} | AI Player: {score["AI Player"]}</p>
        </div>
      );
    }
  }

  // ----------------------------
  // Render UI based on game state.
  // ----------------------------
  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>3 Degrees Game</h1>
      {gameState === "setup_p1_strength" && (
        <>
          <h2>Setup: Player 1 - Select 3 Strength Categories (from 12 available)</h2>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => handleP1SelectStrength(cat)}
              disabled={player1Strengths.includes(cat)}
            >
              {cat}
            </button>
          ))}
          <p>Your Selected Strengths: {player1Strengths.join(", ")}</p>
        </>
      )}
      {gameState === "setup_p1_weakness" && (
        <>
          <h2>Setup: Player 1 - Select 3 Weakness Categories for AI (from remaining)</h2>
          {allCategories.filter(cat => !player1Strengths.includes(cat)).map(cat => (
            <button
              key={cat}
              onClick={() => handleP1SelectWeakness(cat)}
              disabled={player1Weaknesses.includes(cat)}
            >
              {cat}
            </button>
          ))}
          <p>Your Assigned AI Weaknesses: {player1Weaknesses.join(", ")}</p>
        </>
      )}
      {gameState === "playing" && (
        <>
          <h2>Round: {round} - {currentPlayer}'s Turn</h2>
          {currentPlayer === "Player 1" && !selectedCategory && (
            <>
              <h3>Select a Category to Play (from your 6 assigned categories):</h3>
              {availableCategories.map(cat => (
                <button key={cat} onClick={() => handleSelectCategory(cat)}>
                  {cat}
                </button>
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
                    placeholder="Type your answer"
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
