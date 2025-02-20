import React, { useState } from 'react';
import { questions } from './data/questions';

// Helper function for answer tolerance (85% letter match for fill-type answers)
// Also works if answer is provided as an array of acceptable answers.
function isAnswerAcceptable(userAns, correctAns) {
  // If correctAns is an array, check if any answer in the array is acceptable.
  if (Array.isArray(correctAns)) {
    return correctAns.some(ans => isAnswerAcceptable(userAns, ans));
  }
  // For numeric answers, require exact match.
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

// All 12 available categories.
const allCategories = [
  "History", "Science", "Geography", "Math", "Literature", "Sports",
  "Music", "Art", "Technology", "Politics", "Movies", "Travel"
];

function App() {
  // Game phases:
  // "setup_p1_strength" - Player 1 selects 3 strengths.
  // "setup_p1_weakness" - Player 1 selects 3 weaknesses for the AI.
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

  // Determine current player: even turns = Player 1, odd turns = AI.
  const currentPlayer = turn % 2 === 0 ? "Player 1" : "AI Player";

  // ----------------------------
  // Pregame Setup: Player 1 selects 3 strengths.
  // ----------------------------
  const handleP1SelectStrength = (cat) => {
    if (player1Strengths.length < 3 && !player1Strengths.includes(cat)) {
      const newStrengths = [...player1Strengths, cat];
      setPlayer1Strengths(newStrengths);
      if (newStrengths.length === 3) {
        setGameState("setup_p1_weakness");
      }
    }
  };

  // ----------------------------
  // Pregame Setup: Player 1 selects 3 weaknesses for the AI.
  // ----------------------------
  const handleP1SelectWeakness = (cat) => {
    if (player1Weaknesses.length < 3 && !player1Weaknesses.includes(cat)) {
      const newWeaknesses = [...player1Weaknesses, cat];
      setPlayer1Weaknesses(newWeaknesses);
      if (newWeaknesses.length === 3) {
        setGameState("setup_ai");
      }
    }
  };

  // ----------------------------
  // Pregame Setup: AI auto-selects its own strengths and assigns weaknesses for Player 1.
  // For demo purposes, AI selects the first 3 available from the remaining list.
  // ----------------------------
  if (gameState === "setup_ai") {
    const remaining = allCategories.filter(cat => !player1Strengths.includes(cat));
    if (aiStrengths.length < 3) {
      setAiStrengths(remaining.slice(0, 3));
    }
    if (aiWeaknesses.length < 3) {
      setAiWeaknesses(remaining.slice(3, 6));
    }
    if (aiStrengths.length === 3 && aiWeaknesses.length === 3) {
      setGameState("playing");
    }
  }

  // ----------------------------
  // In-game: Determine available categories.
  // For Player 1: Union of (player1Strengths) and (aiWeaknesses).
  // For AI: Union of (aiStrengths) and (player1Weaknesses).
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
  // Retrieve a random question for a given category and degree.
  // ----------------------------
  const getQuestion = (cat, deg) => {
    const qs = questions[cat].degrees[deg];
    return qs && qs.length > 0 ? qs[Math.floor(Math.random() * qs.length)] : null;
  };

  // ----------------------------
  // When a category is selected, initialize question progression.
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
  // Answer submission handling with steal mechanism.
  // Also, award double points for fill-in answers.
  // ----------------------------
  const handleSubmitAnswer = () => {
    let isCorrect = false;
    if (currentPlayer === "Player 1") {
      if (currentQuestion) {
        if (currentQuestion.type === "fill") {
          isCorrect = isAnswerAcceptable(
            answer,
            Array.isArray(currentQuestion.answer) ? currentQuestion.answer[0] : currentQuestion.answer
          );
        } else {
          // For MC, require an exact (case-insensitive) match.
          isCorrect = answer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
        }
      }
    } else {
      // For AI, simulate a correct answer with 70% probability.
      isCorrect = Math.random() < 0.7;
    }

    if (isCorrect) {
      setFeedback(`${currentPlayer} answered correctly!`);
      // Base points are degree * 10; double for fill questions.
      let basePoints = degree * 10;
      if (currentQuestion.type === "fill") {
        basePoints *= 2;
      }
      // Bonus: add extra if the answered category is a weakness for the current player.
      if (currentPlayer === "Player 1") {
        basePoints += aiWeaknesses.includes(selectedCategory) ? 20 : 10;
      } else {
        basePoints += player1Weaknesses.includes(selectedCategory) ? 20 : 10;
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
      // Steal mechanism: Opponent gets a 60% chance to steal.
      const opponent = currentPlayer === "Player 1" ? "AI Player" : "Player 1";
      if (Math.random() < 0.6) {
        setFeedback(`${opponent} steals the question!`);
        let stealPoints = degree * 10;
        if (currentQuestion.type === "fill") {
          stealPoints *= 2;
        }
        if (opponent === "Player 1") {
          stealPoints += aiWeaknesses.includes(selectedCategory) ? 20 : 10;
        } else {
          stealPoints += player1Weaknesses.includes(selectedCategory) ? 20 : 10;
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
  // Game Over Condition: Only check during playing phase.
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
                currentQuestion.type === "mc" ? (
                  <>
                    {currentQuestion.choices.map((choice, index) => (
                      <button key={index} onClick={() => { setAnswer(choice); handleSubmitAnswer(); }}>
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
                    <button onClick={handleSubmitAnswer}>Submit Answer</button>
                  </>
                )
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
