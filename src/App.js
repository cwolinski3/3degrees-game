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

// All available categories.
const allCategories = [
  "History", "Science", "Geography", "Math", "Literature", "Sports",
  "Music", "Art", "Technology", "Politics", "Movies", "Travel"
];

function App() {
  // ----------------------------
  // Game Phase State:
  // "setup_p1_strength": Player 1 selects 3 strength categories.
  // "setup_p1_weakness": Player 1 selects 3 weakness categories for AI.
  // "playing": Gameplay is active.
  // ----------------------------
  const [gameState, setGameState] = useState("setup_p1_strength");
  const [player1Strengths, setPlayer1Strengths] = useState([]);
  const [player1Weaknesses, setPlayer1Weaknesses] = useState([]);
  const [aiStrengths, setAiStrengths] = useState([]);
  const [aiWeaknesses, setAiWeaknesses] = useState([]);
  
  // ----------------------------
  // In-game Variables:
  // turn: used for turn parity.
  // selectedCategory: category chosen for current turn.
  // currentTopic: random topic chosen for current turn.
  // degree: current degree (1, 2, or 3) for the question.
  // currentQuestion: current question object.
  // answer: stores Player 1's input.
  // feedback: message to display to the user.
  // score: tracks scores for Player 1 and AI.
  // round: current round number (game ends after 5 rounds).
  // masteredCategories: tracks which categories have been mastered by each player.
  // ----------------------------
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
  
  // ----------------------------
  // (Optional) Steal State – reserved for future extension.
  // ----------------------------
  const [stealTurn, setStealTurn] = useState(null);
  
  // Active player: determined by turn parity (stealTurn not actively used here).
  const activePlayer = (turn % 2 === 0) ? "Player 1" : "AI Player";
  
  // ----------------------------
  // Helper: clearTurnState – resets per-turn selections.
  // ----------------------------
  const clearTurnState = () => {
    setSelectedCategory(null);
    setCurrentTopic(null);
    setDegree(1);
    setStealTurn(null);
  };
  
  // ----------------------------
  // resetGame: Resets the entire game state.
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
    console.log("Selected Strength:", cat);
    if (player1Strengths.length < 3 && !player1Strengths.includes(cat)) {
      const newStr = [...player1Strengths, cat];
      setPlayer1Strengths(newStr);
      if (newStr.length === 3) {
        setGameState("setup_p1_weakness");
        console.log("Transitioning to Weakness Selection");
      }
    }
  };
  
  // ----------------------------
  // Pregame: Player 1 selects 3 weakness categories for AI.
  // ----------------------------
  const handleP1SelectWeakness = (cat) => {
    console.log("Selected AI Weakness:", cat);
    if (player1Weaknesses.length < 3 && !player1Weaknesses.includes(cat)) {
      const newWeak = [...player1Weaknesses, cat];
      setPlayer1Weaknesses(newWeak);
      if (newWeak.length === 3) {
        setGameState("setup_ai");
        console.log("Transitioning to AI Selection");
      }
    }
  };
  
  // ----------------------------
  // Pregame: AI auto-selects its strengths and weaknesses.
  // In this version, AI selections are made independently from all categories.
  // ----------------------------
  useEffect(() => {
    if (gameState === "setup_ai" && player1Weaknesses.length === 3) {
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
      console.log("AI Strengths:", aiStr);
      console.log("AI Weaknesses:", aiWeak);
      setAiStrengths(aiStr);
      setAiWeaknesses(aiWeak);
      setGameState("playing");
      console.log("Transitioning to Gameplay");
    }
  }, [player1Weaknesses, gameState]);
  
  // ----------------------------
  // Gameplay: Compute available categories for active player.
  // For Player 1: available = (player1Strengths U aiWeaknesses) minus mastered categories.
  // For AI: available = (aiStrengths U player1Weaknesses) minus mastered categories.
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
    // Fallback: if no available categories, default to all.
    if (availableCategories.length === 0) {
      availableCategories = allCategories;
      console.log("Fallback: using all categories");
    }
    console.log("Available categories for", activePlayer, ":", availableCategories);
  }
  
  // ----------------------------
  // getQuestion: Returns a random question from the current topic at the given degree.
  // ----------------------------
  const getQuestion = (deg) => {
    if (!currentTopic) return null;
    const qs = currentTopic.degrees?.[deg];
    console.log(`Questions for "${currentTopic.topic}", Degree ${deg}:`, qs);
    return qs && qs.length > 0 ? qs[Math.floor(Math.random() * qs.length)] : null;
  };
  
  // ----------------------------
  // useEffect: When currentTopic or degree changes, fetch a new question (with a 100ms delay).
  // ----------------------------
  useEffect(() => {
    if (gameState === "playing" && selectedCategory && currentTopic && degree) {
      const timer = setTimeout(() => {
        const q = getQuestion(degree);
        if (q) {
          setCurrentQuestion(q);
          console.log("Fetched new question for Degree", degree, ":", q);
        } else {
          setFeedback(`No questions available for "${currentTopic.topic}" at Degree ${degree}. Turn passes.`);
          clearTurnState();
          setTurn(prev => prev + 1);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentTopic, degree, selectedCategory, gameState]);
  
  // ----------------------------
  // handleSelectCategory: When a category is chosen, clear previous state and choose a random topic.
  // ----------------------------
  const handleSelectCategory = (cat) => {
    console.log("handleSelectCategory called with:", cat);
    clearTurnState();
    setSelectedCategory(cat);
    setDegree(1);
    const topics = questions[cat];
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
    console.log("Selected category:", cat, "Chosen topic:", chosenTopic.topic, "Question:", q);
  };
  
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
  
  // ----------------------------
  // Game Over: End game after 5 rounds or when Player 1 masters all available categories.
  // ----------------------------
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
  
  // ----------------------------
  // Render Gameplay Interface.
  // ----------------------------
  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '20px' }}>
      <h1>3 Degrees Game</h1>
      {gameState === "setup_p1_strength" && (
        <>
          <h2>Setup: Player 1 - Select 3 Strength Categories (from 12 available)</h2>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => { console.log("Category button clicked:", cat); handleP1SelectStrength(cat); }}
              disabled={player1Strengths.includes(cat)}
            >
              {cat}
            </button>
          ))}
          <p>Your Strengths: {player1Strengths.join(", ")}</p>
        </>
      )}
      {gameState === "setup_p1_weakness" && (
        <>
          <h2>Setup: Player 1 - Select 3 Weakness Categories for AI (from remaining)</h2>
          {allCategories.filter(cat => !player1Strengths.includes(cat)).map(cat => (
            <button
              key={cat}
              onClick={() => { console.log("Weakness button clicked:", cat); handleP1SelectWeakness(cat); }}
              disabled={player1Weaknesses.includes(cat)}
            >
              {cat}
            </button>
          ))}
          <p>Assigned AI Weaknesses: {player1Weaknesses.join(", ")}</p>
        </>
      )}
      {gameState === "playing" && (
        <>
          <h2>Round: {round} - {activePlayer}'s Turn</h2>
          {(!selectedCategory && activePlayer === "Player 1") && (
            <>
              <h3>Select a Category to Play (from your available categories):</h3>
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
