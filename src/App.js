import React, { useState, useEffect } from 'react';
// Import the data using named exports.
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

// List of all categories.
const allCategories = [
  "History", "Science", "Geography", "Math", "Literature", "Sports",
  "Music", "Art", "Technology", "Politics", "Movies", "Travel"
];

function App() {
  // --- Mode Selection ---
  const [mode, setMode] = useState(null); // "trivia" or "education"

  // --- Pregame and Game state ---
  const [gameState, setGameState] = useState("setup_p1_strength"); 
  const [player1Strengths, setPlayer1Strengths] = useState([]);
  const [player1Weaknesses, setPlayer1Weaknesses] = useState([]);
  const [aiStrengths, setAiStrengths] = useState([]);
  const [aiWeaknesses, setAiWeaknesses] = useState([]);

  // --- In-game variables ---
  const [turn, setTurn] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null); // Fixed topic for the turn.
  const [degree, setDegree] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState({ "Player 1": 0, "AI Player": 0 });
  const [round, setRound] = useState(1);
  const [masteredCategories, setMasteredCategories] = useState({ "Player 1": [], "AI Player": [] });
  
  // --- Steal state ---
  // When non-null, a steal opportunity is active and forces the off-turn (Player 1) to have control.
  const [stealTurn, setStealTurn] = useState(null);

  // Determine active player: if stealTurn is active, use that; otherwise, by turn parity.
  const activePlayer = stealTurn ? stealTurn : (turn % 2 === 0 ? "Player 1" : "AI Player");

  // --- Data source ---
  // Use educationQuestions if mode is "education"; otherwise, use triviaQuestions.
  const dataSource = mode === "education" ? educationQuestions : triviaQuestions;

  // --- Helper: clearTurnState ---
  // This resets per-turn selections so a new random topic is chosen when a new category is selected.
  const clearTurnState = () => {
    setSelectedCategory(null);
    setCurrentTopic(null);
    setDegree(1);
    setStealTurn(null);
  };

  // --- resetGame ---
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

  // --- PREGAME: Strength Selection ---
  if (gameState === "setup_p1_strength") {
    return (
      <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
        <h1>3º Master of Knowledge - {mode === "education" ? "Education Mode" : "Trivia Mode"}</h1>
        <h2>Select 3 Strength Categories</h2>
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              if (player1Strengths.length < 3 && !player1Strengths.includes(cat)) {
                setPlayer1Strengths([...player1Strengths, cat]);
              }
            }}
            disabled={player1Strengths.includes(cat)}
          >
            {cat}
          </button>
        ))}
        <p>Your Strengths: {player1Strengths.join(", ")}</p>
        {player1Strengths.length === 3 && (
          <button onClick={() => setGameState("setup_p1_weakness")}>Next: Select Weaknesses</button>
        )}
      </div>
    );
  }

  // --- PREGAME: Weakness Selection ---
  if (gameState === "setup_p1_weakness") {
    const availableForWeakness = allCategories.filter(cat => !player1Strengths.includes(cat));
    return (
      <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
        <h1>3º Master of Knowledge - {mode === "education" ? "Education Mode" : "Trivia Mode"}</h1>
        <h2>Select 3 Weakness Categories for AI</h2>
        {availableForWeakness.map(cat => (
          <button
            key={cat}
            onClick={() => {
              if (player1Weaknesses.length < 3 && !player1Weaknesses.includes(cat)) {
                setPlayer1Weaknesses([...player1Weaknesses, cat]);
              }
            }}
            disabled={player1Weaknesses.includes(cat)}
          >
            {cat}
          </button>
        ))}
        <p>Assigned AI Weaknesses: {player1Weaknesses.join(", ")}</p>
        {player1Weaknesses.length === 3 && (
          <button onClick={() => {
            // AI auto-selects its strengths and weaknesses from remaining categories.
            const remaining = allCategories.filter(cat => !player1Strengths.includes(cat));
            setAiStrengths(remaining.slice(0, 3));
            setAiWeaknesses(remaining.slice(3, 6));
            setGameState("playing");
          }}>
            Next
          </button>
        )}
      </div>
    );
  }

  // --- GAMEPLAY ---
  // Calculate available categories for the active player.
  let availableCategories = [];
  if (gameState === "playing") {
    if (activePlayer === "Player 1") {
      // For Player 1, available = (player1Strengths U aiWeaknesses) minus mastered.
      availableCategories = [...player1Strengths, ...aiWeaknesses].filter(
        cat => !masteredCategories["Player 1"].includes(cat)
      );
    } else {
      availableCategories = [...aiStrengths, ...player1Weaknesses].filter(
        cat => !masteredCategories["AI Player"].includes(cat)
      );
    }
    // For debugging:
    console.log("Available categories for", activePlayer, ":", availableCategories);
  }

  // getQuestion: Returns a random question from the current topic at the given degree.
  const getQuestion = (deg) => {
    if (!currentTopic) return null;
    const qs = currentTopic.degrees?.[deg];
    return qs && qs.length > 0 ? qs[Math.floor(Math.random() * qs.length)] : null;
  };

  // handleSelectCategory: When a category is chosen, clear previous state and select a random topic.
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
  };

  // useEffect: When currentTopic or degree changes (and not during a steal), fetch a new question.
  useEffect(() => {
    if (gameState === "playing" && selectedCategory && currentTopic && degree && !stealTurn) {
      const q = getQuestion(degree);
      if (q) {
        setCurrentQuestion(q);
      } else {
        setFeedback(`No questions available for "${currentTopic.topic}" at Degree ${degree}. Turn passes.`);
        clearTurnState();
        setTurn(turn + 1);
      }
    }
  }, [currentTopic, degree, selectedCategory, gameState, turn, stealTurn]);

  // --- handleStealCategory: For Player 1 (off-turn) to choose a new category during a steal attempt.
  const handleStealCategory = (cat) => {
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
    setFeedback("Steal attempt: Answer the new Degree 1 question.");
    // Force stealTurn to remain for Player 1.
    setStealTurn("Player 1");
  };

  // --- handleSubmitAnswer: Process answer submission.
  // This includes both normal turns and steal attempts.
  const handleSubmitAnswer = (providedAnswer) => {
    const userAnswer = providedAnswer !== undefined ? providedAnswer : answer;
    let isCorrect = false;
    
    // If in steal mode, process as a steal attempt.
    if (stealTurn) {
      if (currentQuestion.type === "fill") {
        isCorrect = isAnswerAcceptable(
          userAnswer,
          Array.isArray(currentQuestion.answer) ? currentQuestion.answer[0] : currentQuestion.answer
        );
      } else {
        isCorrect = Array.isArray(currentQuestion.answer)
          ? currentQuestion.answer.some(a => a.trim().toLowerCase() === userAnswer.trim().toLowerCase())
          : userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
      }
      if (isCorrect) {
        // Award double points for the steal question.
        let basePoints = degree * 10;
        if (currentQuestion.type === "fill") basePoints *= 2;
        const bonus = player1Weaknesses.includes(selectedCategory) ? 10 : 0;
        const stealPoints = 2 * (basePoints + bonus);
        setScore(prev => ({ ...prev, ["Player 1"]: prev["Player 1"] + stealPoints }));
        // Successful steal: Player 1 retains their turn and continues in this category.
        setStealTurn(null);
        if (degree < 3) {
          setDegree(degree + 1);
        } else {
          setFeedback(`Player 1 has mastered ${selectedCategory} by stealing!`);
          setMasteredCategories(prev => ({
            ...prev,
            ["Player 1"]: [...prev["Player 1"], selectedCategory]
          }));
          clearTurnState();
        }
      } else {
        // On a failed steal, award fallback points and pass the turn.
        let stealPoints = degree * 10;
        if (currentQuestion.type === "fill") stealPoints *= 2;
        const bonus = player1Weaknesses.includes(selectedCategory) ? 10 : 0;
        stealPoints += bonus;
        setScore(prev => ({ ...prev, ["Player 1"]: prev["Player 1"] + stealPoints }));
        setFeedback(`Steal failed: You earn ${stealPoints} points. Turn passes.`);
        clearTurnState();
        setTurn(turn + 1);
        setRound(round + 1);
      }
      setAnswer('');
      return;
    }
    
    // Normal turn processing.
    if (activePlayer === "Player 1") {
      if (currentQuestion) {
        if (currentQuestion.type === "fill") {
          isCorrect = isAnswerAcceptable(
            userAnswer,
            Array.isArray(currentQuestion.answer) ? currentQuestion.answer[0] : currentQuestion.answer
          );
        } else {
          isCorrect = Array.isArray(currentQuestion.answer)
            ? currentQuestion.answer.some(a => a.trim().toLowerCase() === userAnswer.trim().toLowerCase())
            : userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
        }
      }
    } else {
      // Simulate AI answer with 70% chance of correctness.
      isCorrect = Math.random() < 0.7;
    }
    
    if (isCorrect) {
      let basePoints = degree * 10;
      if (currentQuestion.type === "fill") basePoints *= 2;
      // Normal bonus: for Player 1, +10 if the category is in their weaknesses; for AI, similar.
      const bonus = activePlayer === "Player 1"
        ? (player1Weaknesses.includes(selectedCategory) ? 10 : 0)
        : (aiWeaknesses.includes(selectedCategory) ? 10 : 0);
      const totalPoints = basePoints + bonus;
      setScore(prev => ({ ...prev, [activePlayer]: prev[activePlayer] + totalPoints }));
      if (degree < 3) {
        setDegree(degree + 1);
      } else {
        setFeedback(`${activePlayer} has mastered ${selectedCategory} for topic "${currentTopic.topic}"!`);
        setMasteredCategories(prev => ({
          ...prev,
          [activePlayer]: [...prev[activePlayer], selectedCategory]
        }));
        clearTurnState();
        setTurn(turn + 1);
        if (activePlayer === "AI Player") setRound(round + 1);
      }
    } else {
      setFeedback(`${activePlayer} answered incorrectly. Turn passes.`);
      clearTurnState();
      setTurn(turn + 1);
      if (activePlayer === "AI Player") setRound(round + 1);
    }
    setAnswer('');
  };

  // --- Game Over: If 5 rounds are completed or all available categories for Player 1 are mastered ---
  if (gameState === "playing") {
    const totalCats = [...player1Strengths, ...aiWeaknesses].length;
    if (round > 5 || masteredCategories["Player 1"].length === totalCats) {
      const winner = score["Player 1"] > score["AI Player"] ? "Player 1" : "AI Player";
      const winReason = masteredCategories["Player 1"].length === totalCats ? "by Mastery" : "by Total Points Scored";
      return (
        <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
          <h1>Game Over</h1>
          <h2>{winner} wins {winReason}!</h2>
          <p>Final Score - Player 1: {score["Player 1"]} | AI Player: {score["AI Player"]}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      );
    }
  }

  // --- Render the Game Interface ---
  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
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
