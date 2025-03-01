import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';

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

const allCategories = [
  "History", "Science", "Geography", "Math", "Literature", "Sports",
  "Music", "Art", "Technology", "Politics", "Movies", "Travel"
];

function App() {
  // Game phase state.
  const [gameState, setGameState] = useState("setup_p1_strength");
  const [player1Strengths, setPlayer1Strengths] = useState([]);
  const [player1Weaknesses, setPlayer1Weaknesses] = useState([]);
  const [aiStrengths, setAiStrengths] = useState([]);
  const [aiWeaknesses, setAiWeaknesses] = useState([]);

  // In-game state.
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
  
  // New state: stealTurn forces control for a steal attempt (only off-turn Player 1 can steal).
  // When non-null, it indicates that Player 1 is in a steal opportunity.
  const [stealTurn, setStealTurn] = useState(null);

  // Determine active player: if stealTurn is active, that player is active; otherwise, normal turn parity.
  const activePlayer = stealTurn ? stealTurn : (turn % 2 === 0 ? "Player 1" : "AI Player");

  // ----------------------------
  // clearTurnState: Reset per-turn variables so a new topic is chosen.
  // ----------------------------
  const clearTurnState = () => {
    setSelectedCategory(null);
    setCurrentTopic(null);
    setDegree(1);
    setStealTurn(null);
  };

  // ----------------------------
  // resetGame: Reset entire game state.
  // ----------------------------
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

  // ----------------------------
  // Pregame: Player 1 selects 3 strength categories.
  // ----------------------------
  const handleP1SelectStrength = (cat) => {
    console.log("handleP1SelectStrength:", cat);
    if (player1Strengths.length < 3 && !player1Strengths.includes(cat)) {
      const newStrengths = [...player1Strengths, cat];
      setPlayer1Strengths(newStrengths);
      if (newStrengths.length === 3) {
        setGameState("setup_p1_weakness");
        console.log("Transition to setup_p1_weakness");
      }
    }
  };

  // ----------------------------
  // Pregame: Player 1 selects 3 weaknesses for AI.
  // ----------------------------
  const handleP1SelectWeakness = (cat) => {
    console.log("handleP1SelectWeakness:", cat);
    if (player1Weaknesses.length < 3 && !player1Weaknesses.includes(cat)) {
      const newWeaknesses = [...player1Weaknesses, cat];
      setPlayer1Weaknesses(newWeaknesses);
      if (newWeaknesses.length === 3) {
        setGameState("setup_ai");
        console.log("Transition to setup_ai");
      }
    }
  };

  // ----------------------------
  // Pregame: AI auto-selects its strengths and weaknesses.
  // ----------------------------
  useEffect(() => {
    if (gameState === "setup_ai") {
      const remaining = allCategories.filter(cat => !player1Strengths.includes(cat));
      console.log("AI remaining:", remaining);
      if (aiStrengths.length < 3) {
        setAiStrengths(remaining.slice(0, 3));
        console.log("AI Strengths:", remaining.slice(0, 3));
      }
      if (aiWeaknesses.length < 3) {
        setAiWeaknesses(remaining.slice(3, 6));
        console.log("AI Weaknesses:", remaining.slice(3, 6));
      }
      if (aiStrengths.length >= 3 && aiWeaknesses.length >= 3) {
        setGameState("playing");
        console.log("Transition to playing phase");
      }
    }
  }, [gameState, player1Strengths, aiStrengths, aiWeaknesses]);

  // ----------------------------
  // In-game: Determine available categories for active player.
  // For Player 1: available = (player1Strengths ∪ aiWeaknesses) minus mastered.
  // For AI: available = (aiStrengths ∪ player1Weaknesses) minus mastered.
  // ----------------------------
  let availableCategories = [];
  if (gameState === "playing") {
    if (activePlayer === "Player 1") {
      availableCategories = [...player1Strengths, ...aiWeaknesses].filter(
        cat => !masteredCategories["Player 1"].includes(cat)
      );
    } else {
      availableCategories = [...aiStrengths, ...player1Weaknesses].filter(
        cat => !masteredCategories["AI Player"].includes(cat)
      );
    }
    console.log("Available categories for", activePlayer, ":", availableCategories);
  }

  // ----------------------------
  // getQuestion: Return a random question from currentTopic for a given degree.
  // ----------------------------
  const getQuestion = (deg) => {
    if (!currentTopic) return null;
    const qs = currentTopic.degrees?.[deg];
    console.log(`For topic "${currentTopic.topic}", degree ${deg}:`, qs);
    return qs && qs.length > 0 ? qs[Math.floor(Math.random() * qs.length)] : null;
  };

  // ----------------------------
  // handleSelectCategory: When a category is chosen, clear previous state and pick a random topic.
  // ----------------------------
  const handleSelectCategory = (cat) => {
    console.log("handleSelectCategory called with:", cat);
    clearTurnState(); // Clear previous topic.
    setSelectedCategory(cat);
    setDegree(1);
    const topics = questions[cat];
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
    console.log("Selected category:", cat, "Chosen topic:", chosenTopic.topic, "Question:", q);
  };

  // ----------------------------
  // useEffect: When currentTopic or degree changes, fetch a new question (with 100ms delay).
  // ----------------------------
  useEffect(() => {
    if (gameState === "playing" && selectedCategory && currentTopic && degree) {
      const timer = setTimeout(() => {
        const q = getQuestion(degree);
        if (q) {
          setCurrentQuestion(q);
          console.log(`Fetched new question for degree ${degree}:`, q);
        } else {
          console.error(`No question for topic "${currentTopic.topic}" at degree ${degree}`);
          setFeedback(`No questions available for "${currentTopic.topic}" at Degree ${degree}. Turn passes.`);
          clearTurnState();
          setTurn(turn + 1);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentTopic, degree, selectedCategory, gameState, turn]);

  // ----------------------------
  // handleSubmitAnswer: Process answer submission.
  // ----------------------------
  const handleSubmitAnswer = (providedAnswer) => {
    const userAnswer = providedAnswer !== undefined ? providedAnswer : answer;
    let isCorrect = false;
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
      console.log(`${activePlayer} answered correctly!`);
      let basePoints = degree * 10;
      if (currentQuestion.type === "fill") basePoints *= 2;
      const bonus = activePlayer === "Player 1"
        ? (player1Weaknesses.includes(selectedCategory) ? 10 : 0)
        : (aiWeaknesses.includes(selectedCategory) ? 10 : 0);
      const totalPoints = basePoints + bonus;
      setScore(prev => ({ ...prev, [activePlayer]: prev[activePlayer] + totalPoints }));
      console.log(`Correct: ${activePlayer} earns ${totalPoints} points (base ${basePoints} + bonus ${bonus}).`);
      if (degree < 3) {
        setDegree(degree + 1);
      } else {
        console.log(`${activePlayer} has mastered ${selectedCategory} for topic "${currentTopic.topic}"!`);
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
      console.log(`${activePlayer} answered incorrectly.`);
      setFeedback(`${activePlayer} answered incorrectly. Turn passes.`);
      clearTurnState();
      setTurn(turn + 1);
      if (activePlayer === "AI Player") setRound(round + 1);
    }
    setAnswer('');
  };

  // ----------------------------
  // Game Over: End game after 5 rounds or if Player 1 masters all available categories.
  // ----------------------------
  if (gameState === "playing") {
    const totalCats = [...player1Strengths, ...aiWeaknesses].length;
    if (round > 5 || masteredCategories["Player 1"].length === totalCats) {
      const winner = score["Player 1"] > score["AI Player"] ? "Player 1" : "AI Player";
      const winReason = masteredCategories["Player 1"].length === totalCats ? "by Mastery" : "by Total Points Scored";
      return (
        <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial' }}>
          <h1>Game Over</h1>
          <h2>{winner} wins {winReason}!</h2>
          <p>Final Score - Player 1: {score["Player 1"]} | AI Player: {score["AI Player"]}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      );
    }
  }

  // ----------------------------
  // Render Gameplay Interface.
  // ----------------------------
  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial' }}>
      <h1>3 Degrees Game</h1>
      {gameState === "playing" && (
        <>
          <h2>Round: {round} - {activePlayer}'s Turn</h2>
          {(!selectedCategory && activePlayer === "Player 1") && (
            <>
              <h3>Select a Category to Play:</h3>
              {availableCategories.map(cat => (
                <button key={cat} onClick={() => { console.log("handleSelectCategory called for:", cat); handleSelectCategory(cat); }}>
                  {cat}
                </button>
              ))}
            </>
          )}
          {(!selectedCategory && activePlayer === "AI Player") && (
            <>
              <h3>AI is selecting a category...</h3>
              {availableCategories.length > 0 ? (
                <button onClick={() => { console.log("AI selects category:", availableCategories[0]); handleSelectCategory(availableCategories[0]); }}>
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
                      <button key={index} onClick={() => { console.log("MC choice selected:", choice); handleSubmitAnswer(choice); }}>
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
