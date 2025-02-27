// src/App.js
import React, { useState, useEffect } from 'react';

// Import data using named exports. Make sure your data files export like: export const questions = { ... };
import { questions as triviaQuestions } from './data/questions';
import { questions as educationQuestions } from './data/educationQuestions';

/*
  Helper Function:
  isAnswerAcceptable() returns true if the user's answer is at least 85% similar to the correct answer.
  This supports multiple acceptable answers (if currentQuestion.answer is an array).
*/
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

/*
  Constant: allCategories
  This is the full list of available categories.
*/
const allCategories = [
  "History", "Science", "Geography", "Math", "Literature", "Sports",
  "Music", "Art", "Technology", "Politics", "Movies", "Travel"
];

function App() {
  // ========================================
  // MODE SELECTION & PREGAME STATE
  // ========================================
  // mode: "trivia" or "education"
  const [mode, setMode] = useState(null);

  // gameState can be one of:
  // "setup_p1_strength" – Player 1 is selecting 3 strength categories.
  // "setup_p1_weakness" – Player 1 is selecting 3 weakness categories for AI.
  // "playing" – Gameplay is active.
  const [gameState, setGameState] = useState("setup_p1_strength");

  // Player 1 selections (they can overlap with each other)
  const [player1Strengths, setPlayer1Strengths] = useState([]);
  const [player1Weaknesses, setPlayer1Weaknesses] = useState([]);

  // AI selections – These are chosen randomly later (independently from allCategories)
  const [aiStrengths, setAiStrengths] = useState([]);
  const [aiWeaknesses, setAiWeaknesses] = useState([]);

  // ========================================
  // GAMEPLAY STATE VARIABLES
  // ========================================
  // turn: increments each turn (used for turn parity)
  const [turn, setTurn] = useState(0);
  // selectedCategory: the category chosen for the current turn
  const [selectedCategory, setSelectedCategory] = useState(null);
  // currentTopic: once a category is chosen, a random topic (from that category) is selected and fixed for the turn
  const [currentTopic, setCurrentTopic] = useState(null);
  // degree: question degree (1, 2, or 3)
  const [degree, setDegree] = useState(1);
  // currentQuestion: the current question object to display
  const [currentQuestion, setCurrentQuestion] = useState(null);
  // answer: stores Player 1's answer input
  const [answer, setAnswer] = useState('');
  // feedback: for displaying messages to the user
  const [feedback, setFeedback] = useState('');
  // score: keeps track of scores for Player 1 and AI
  const [score, setScore] = useState({ "Player 1": 0, "AI Player": 0 });
  // round: current round number (game ends after 5 rounds)
  const [round, setRound] = useState(1);
  // masteredCategories: tracks which categories have been mastered by each player
  const [masteredCategories, setMasteredCategories] = useState({ "Player 1": [], "AI Player": [] });

  // (Optional) Steal state for advanced steal mechanism; not fully implemented here.
  const [stealTurn, setStealTurn] = useState(null);

  // Determine active player. If stealTurn is active, force Player 1; else use turn parity.
  const activePlayer = stealTurn ? stealTurn : (turn % 2 === 0 ? "Player 1" : "AI Player");

  // ========================================
  // DATA SOURCE SELECTION
  // ========================================
  // If Education Mode is chosen, use educationQuestions; otherwise, use triviaQuestions.
  const dataSource = mode === "education" ? educationQuestions : triviaQuestions;

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  // clearTurnState: clears per-turn selections so a new topic/question can be chosen
  const clearTurnState = () => {
    setSelectedCategory(null);
    setCurrentTopic(null);
    setDegree(1);
    setStealTurn(null);
  };

  // resetGame: resets the entire game to initial state
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

  // getQuestion: returns a random question from the current topic at the given degree
  const getQuestion = (deg) => {
    if (!currentTopic) return null;
    const qs = currentTopic.degrees?.[deg];
    return qs && qs.length > 0 ? qs[Math.floor(Math.random() * qs.length)] : null;
  };

  // ========================================
  // AUTO-TRANSITIONS FOR PREGAME
  // ========================================

  // When exactly 3 strengths have been selected, auto-transition to weakness selection.
  useEffect(() => {
    if (gameState === "setup_p1_strength" && player1Strengths.length === 3) {
      setGameState("setup_p1_weakness");
      console.log("Transition: Strengths selected; moving to Weakness selection");
    }
  }, [player1Strengths, gameState]);

  // When exactly 3 weaknesses have been selected, have the AI randomly select its own strengths and weaknesses,
  // then transition to gameplay.
  useEffect(() => {
    if (gameState === "setup_p1_weakness" && player1Weaknesses.length === 3) {
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
      console.log("AI Strengths selected:", aiStr);
      console.log("AI Weaknesses selected:", aiWeak);
      setAiStrengths(aiStr);
      setAiWeaknesses(aiWeak);
      setGameState("playing");
      console.log("Transition: Moving to Gameplay");
    }
  }, [player1Weaknesses, gameState]);

  // ========================================
  // RENDERING SCREENS
  // ========================================

  // MODE SELECTION (WELCOME) SCREEN
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

  // PREGAME: Strength Selection Screen
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
                console.log("Strengths Selected:", newStr);
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

  // PREGAME: Weakness Selection Screen
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
                console.log("AI Weaknesses Selected:", newWeak);
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

  // ========================================
  // GAMEPLAY
  // ========================================

  // Determine available categories based on active player.
  let availableCategories = [];
  if (gameState === "playing") {
    if (activePlayer === "Player 1") {
      // For Player 1, available = (player1Strengths ∪ aiWeaknesses) minus any already mastered.
      availableCategories = [...player1Strengths, ...aiWeaknesses].filter(
        cat => !masteredCategories["Player 1"].includes(cat)
      );
    } else {
      // For AI, available = (aiStrengths ∪ player1Weaknesses) minus any already mastered.
      availableCategories = [...aiStrengths, ...player1Weaknesses].filter(
        cat => !masteredCategories["AI Player"].includes(cat)
      );
    }
    console.log("Available Categories for", activePlayer, ":", availableCategories);
  }

  // useEffect: When currentTopic or degree changes, fetch a new question (with a 100ms delay).
  useEffect(() => {
    if (gameState === "playing" && selectedCategory && currentTopic && degree) {
      const timer = setTimeout(() => {
        const q = getQuestion(degree);
        if (q) {
          setCurrentQuestion(q);
          console.log("Fetched Question for Degree", degree, ":", q);
        } else {
          setFeedback(`No questions for "${currentTopic.topic}" at Degree ${degree}. Turn passes.`);
          clearTurnState();
          setTurn(prev => prev + 1);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentTopic, degree, selectedCategory, gameState]);

  // Function: handleSelectCategory
  // When a category is selected, clear previous state and choose a random topic from that category.
  const handleSelectCategory = (cat) => {
    clearTurnState();
    setSelectedCategory(cat);
    setDegree(1);
    const topics = dataSource[cat];
    if (!topics || topics.length === 0) {
      setFeedback(`No topics for ${cat}. Select another category.`);
      return;
    }
    const validTopics = topics.filter(topic => topic.degrees && topic.degrees[1] && topic.degrees[1].length > 0);
    if (validTopics.length === 0) {
      setFeedback(`No valid Degree 1 questions for ${cat}. Select another category.`);
      return;
    }
    const chosenTopic = validTopics[Math.floor(Math.random() * validTopics.length)];
    const q = chosenTopic.degrees[1][Math.floor(Math.random() * chosenTopic.degrees[1].length)];
    setCurrentTopic(chosenTopic);
    setCurrentQuestion(q);
    setFeedback('');
    setAnswer('');
    console.log("Category Selected:", cat, "Chosen Topic:", chosenTopic.topic);
  };

  // Function: handleSubmitAnswer
  // Processes an answer submission for the active player.
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
      // For AI, simulate a 70% chance of a correct answer.
      isCorrect = Math.random() < 0.7;
    }
    
    if (isCorrect) {
      let basePoints = degree * 10;
      if (currentQuestion.type === "fill") basePoints *= 2;
      // Bonus: +10 points if the category is in the active player's weaknesses.
      const bonus = activePlayer === "Player 1"
        ? (player1Weaknesses.includes(selectedCategory) ? 10 : 0)
        : (aiWeaknesses.includes(selectedCategory) ? 10 : 0);
      const totalPoints = basePoints + bonus;
      setScore(prev => ({ ...prev, [activePlayer]: prev[activePlayer] + totalPoints }));
      console.log(activePlayer, "answered correctly. Points earned:", totalPoints);
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
      console.log(activePlayer, "answered incorrectly.");
      clearTurnState();
      setTurn(prev => prev + 1);
      if (activePlayer === "AI Player") setRound(prev => prev + 1);
    }
    setAnswer('');
  };

  // --- Game Over Condition ---
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
