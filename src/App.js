import React, { useState, useEffect } from 'react';
// Use named imports for the questions
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
  // --- Mode selection ---
  const [mode, setMode] = useState(null); // "trivia" or "education"

  // --- Pregame and Game state ---
  const [gameState, setGameState] = useState("setup_p1_strength"); // possible states: setup_p1_strength, setup_p1_weakness, playing
  const [player1Strengths, setPlayer1Strengths] = useState([]);
  const [player1Weaknesses, setPlayer1Weaknesses] = useState([]);
  const [aiStrengths, setAiStrengths] = useState([]);
  const [aiWeaknesses, setAiWeaknesses] = useState([]);
  
  // --- In-game variables ---
  const [turn, setTurn] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null); // once chosen, remains for this turn
  const [degree, setDegree] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState({ "Player 1": 0, "AI Player": 0 });
  const [round, setRound] = useState(1);
  const [masteredCategories, setMasteredCategories] = useState({ "Player 1": [], "AI Player": [] });
  
  // --- Steal state ---
  // Only off-turn (Player 1) can steal; when non-null, it forces Player 1 as the active player.
  const [stealTurn, setStealTurn] = useState(null);

  // Active player: if stealTurn is set, that's active; else use turn parity.
  const activePlayer = stealTurn ? stealTurn : (turn % 2 === 0 ? "Player 1" : "AI Player");

  // Data source: if mode === "education", use educationQuestions; otherwise, triviaQuestions.
  const dataSource = mode === "education" ? educationQuestions : triviaQuestions;

  // --- Helper: clearTurnState (clears per-turn selections so a new random topic is chosen) ---
  const clearTurnState = () => {
    setSelectedCategory(null);
    setCurrentTopic(null);
    setDegree(1);
    setStealTurn(null);
  };

  // --- resetGame: Resets the entire game state ---
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

  // --- PREGAME: Strength Selection Screen ---
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

  // --- PREGAME: Weakness Selection Screen ---
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
          <button onClick={() => setGameState("setup_ai")}>Next</button>
        )}
      </div>
    );
  }

  // --- PREGAME: AI auto-selects its strengths and weaknesses ---
  useEffect(() => {
    if (gameState === "setup_ai") {
      const remaining = allCategories.filter(cat => !player1Strengths.includes(cat));
      // AI picks first 3 as strengths and next 3 as weaknesses.
      if (aiStrengths.length < 3) {
        setAiStrengths(remaining.slice(0, 3));
      }
      if (aiWeaknesses.length < 3) {
        setAiWeaknesses(remaining.slice(3, 6));
      }
      if (remaining.length >= 6) {
        setGameState("playing");
      }
    }
  }, [gameState, player1Strengths, aiStrengths, aiWeaknesses]);

  // --- GAMEPLAY: Determine available categories for the active player ---
  let availableCats = [];
  if (gameState === "playing") {
    if (activePlayer === "Player 1") {
      // For Player 1, available = (player1Strengths U aiWeaknesses) minus those already mastered by Player 1.
      availableCats = [...player1Strengths, ...aiWeaknesses].filter(
        cat => !masteredCategories["Player 1"].includes(cat)
      );
    } else {
      availableCats = [...aiStrengths, ...player1Weaknesses].filter(
        cat => !masteredCategories["AI Player"].includes(cat)
      );
    }
  }

  // --- getQuestion: Returns a random question from currentTopic for a given degree ---
  const getQuestion = (deg) => {
    if (!currentTopic) return null;
    const qs = currentTopic.degrees?.[deg];
    return qs && qs.length > 0 ? qs[Math.floor(Math.random() * qs.length)] : null;
  };

  // --- handleSelectCategory: When a category is chosen, clear previous state and select a new random topic ---
  const handleSelectCategory = (cat) => {
    clearTurnState();
    setSelectedCategory(cat);
    setDegree(1);
    const topics = dataSource[cat];
    if (!topics || topics.length === 0) {
      setFeedback(`No topics available for ${cat}. Please select a different category.`);
      return;
    }
    const validTopics = topics.filter(topic => topic.degrees && topic.degrees[1] && topic.degrees[1].length > 0);
    if (validTopics.length === 0) {
      setFeedback(`No valid Degree 1 questions for ${cat}. Please select a different category.`);
      return;
    }
    const chosenTopic = validTopics[Math.floor(Math.random() * validTopics.length)];
    const q = chosenTopic.degrees[1][Math.floor(Math.random() * chosenTopic.degrees[1].length)];
    setCurrentTopic(chosenTopic);
    setCurrentQuestion(q);
    setFeedback('');
    setAnswer('');
  };

  // --- useEffect: When currentTopic or degree changes (and not in steal turn), fetch a new question ---
  useEffect(() => {
    if (gameState === "playing" && selectedCategory && currentTopic && degree && !stealTurn) {
      const q = getQuestion(degree);
      if (q) {
        setCurrentQuestion(q);
      } else {
        setFeedback(`No questions available for "${currentTopic.topic}" at Degree ${degree}. Turn passes.`);
        clearTurnState();
        setTurn(turn + 1);
        if (activePlayer === "AI Player") setRound(round + 1);
      }
    }
  }, [currentTopic, degree, selectedCategory, gameState, activePlayer, round, turn, stealTurn]);

  // --- handleStealCategory: For Player 1 (off-turn) to choose a new category for steal attempt ---
  const handleStealCategory = (cat) => {
    clearTurnState();
    setSelectedCategory(cat);
    setDegree(1);
    const topics = dataSource[cat];
    if (!topics || topics.length === 0) {
      setFeedback(`No topics available for ${cat}. Please select a different category.`);
      return;
    }
    const validTopics = topics.filter(topic => topic.degrees && topic.degrees[1] && topic.degrees[1].length > 0);
    if (validTopics.length === 0) {
      setFeedback(`No valid Degree 1 questions for ${cat}. Please select a different category.`);
      return;
    }
    const chosenTopic = validTopics[Math.floor(Math.random() * validTopics.length)];
    const q = chosenTopic.degrees[1][Math.floor(Math.random() * chosenTopic.degrees[1].length)];
    setCurrentTopic(chosenTopic);
    setCurrentQuestion(q);
    setFeedback("Steal attempt: Answer the new Degree 1 question.");
    setStealTurn("Player 1");
  };

  // --- handleSubmitAnswer: Process answer submission (normal vs. steal turns) ---
  const handleSubmitAnswer = (providedAnswer) => {
    const userAnswer = providedAnswer !== undefined ? providedAnswer : answer;
    let isCorrect = false;
    
    if (stealTurn) {
      // Processing steal attempt for Player 1.
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
        // For the steal attempt, award double points for this question.
        let basePoints = degree * 10;
        if (currentQuestion.type === "fill") basePoints *= 2;
        const bonus = player1Weaknesses.includes(selectedCategory) ? 10 : 0;
        const stealPoints = 2 * (basePoints + bonus);
        setScore(prev => ({ ...prev, ["Player 1"]: prev["Player 1"] + stealPoints }));
        // Successful steal: Player 1 retains the turn and continues in this category.
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
    
    // Normal answer processing.
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
      if (activePlayer === "AI Player") {
        const player1Available = [...player1Strengths, ...aiWeaknesses].filter(
          cat => !masteredCategories["Player 1"].includes(cat)
        );
        if (player1Available.includes(selectedCategory)) {
          setFeedback("AI answered incorrectly! This category is available for steal. Answer the missed question to steal it.");
          setStealTurn("Player 1");
        } else {
          setFeedback("This category is not available for steal. Please select a new category for your steal attempt.");
          setStealTurn("Player 1");
        }
      } else {
        const oppCorrect = Math.random() < 0.7;
        if (oppCorrect) {
          let basePoints = degree * 10;
          if (currentQuestion.type === "fill") basePoints *= 2;
          const bonus = aiWeaknesses.includes(selectedCategory) ? 10 : 0;
          const stealPoints = basePoints + bonus;
          setScore(prev => ({ ...prev, ["AI Player"]: prev["AI Player"] + stealPoints }));
          if (degree < 3) {
            setDegree(degree + 1);
          } else {
            setFeedback(`AI has mastered ${selectedCategory} by stealing!`);
            setMasteredCategories(prev => ({
              ...prev,
              ["AI Player"]: [...prev["AI Player"], selectedCategory]
            }));
            clearTurnState();
            setTurn(turn + 1);
            setRound(round + 1);
          }
        } else {
          let stealPoints = degree * 10;
          if (currentQuestion.type === "fill") stealPoints *= 2;
          const bonus = aiWeaknesses.includes(selectedCategory) ? 10 : 0;
          stealPoints += bonus;
          setScore(prev => ({ ...prev, ["AI Player"]: prev["AI Player"] + stealPoints }));
          setFeedback(`AI failed on steal and earns ${stealPoints} points. Turn passes.`);
          clearTurnState();
          setTurn(turn + 1);
          setRound(round + 1);
        }
      }
    }
    setAnswer('');
  };

  // --- Game Over Conditions ---
  if (gameState === "playing") {
    const totalCats =
      activePlayer === "Player 1"
        ? [...player1Strengths, ...aiWeaknesses].length
        : [...aiStrengths, ...player1Weaknesses].length;
    if (
      round > 5 ||
      masteredCategories["Player 1"].length === totalCats ||
      masteredCategories["AI Player"].length === totalCats
    ) {
      const winReason = (masteredCategories["Player 1"].length === totalCats ||
                         masteredCategories["AI Player"].length === totalCats)
                        ? "by Mastery"
                        : "by Total Points Scored";
      const winner = score["Player 1"] > score["AI Player"] ? "Player 1" : "AI Player";
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

  // --- Render the Full Game Interface ---
  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>3º Master of Knowledge - {mode === "education" ? "Education Mode" : "Trivia Mode"}</h1>
      {gameState === "setup_p1_strength" && (
        <>
          <h2>Setup: Select 3 Strength Categories</h2>
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
        </>
      )}
      {gameState === "setup_p1_weakness" && (
        <>
          <h2>Setup: Select 3 Weakness Categories for AI</h2>
          {allCategories.filter(cat => !player1Strengths.includes(cat)).map(cat => (
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
            <button onClick={() => setGameState("setup_ai")}>Next</button>
          )}
        </>
      )}
      {gameState === "playing" && (
        <>
          <h2>Round: {round} - {activePlayer}'s Turn</h2>
          {stealTurn === "Player 1" && (
            <div>
              <h3>Steal Opportunity! Select a Category for your steal attempt:</h3>
              {availableCats.map(cat => (
                <button key={cat} onClick={() => handleStealCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          )}
          {(!selectedCategory && !stealTurn) && activePlayer === "Player 1" && (
            <>
              <h3>Select a Category to Play:</h3>
              {availableCats.map(cat => (
                <button key={cat} onClick={() => handleSelectCategory(cat)}>
                  {cat}
                </button>
              ))}
            </>
          )}
          {(!selectedCategory && !stealTurn) && activePlayer === "AI Player" && (
            <>
              <h3>AI is selecting a category...</h3>
              {availableCats.length > 0 ? (
                <button onClick={() => handleSelectCategory(availableCats[0])}>
                  AI selects {availableCats[0]}
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
          <p>Mastered - Player 1: {masteredCategories["Player 1"].join(", ")}</p>
          <p>Mastered - AI Player: {masteredCategories["AI Player"].join(", ")}</p>
        </>
      )}
    </div>
  );
}

export default App;
