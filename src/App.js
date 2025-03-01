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
  // ----------------------------
  // "setup_p1_strength": Player 1 selects 3 strength categories.
  // "setup_p1_weakness": Player 1 selects 3 weakness categories for AI.
  // "playing": Gameplay is active.
  const [gameState, setGameState] = useState("setup_p1_strength");
  const [player1Strengths, setPlayer1Strengths] = useState([]);
  const [player1Weaknesses, setPlayer1Weaknesses] = useState([]);
  const [aiStrengths, setAiStrengths] = useState([]);
  const [aiWeaknesses, setAiWeaknesses] = useState([]);

  // ----------------------------
  // In-game Variables:
  // ----------------------------
  const [turn, setTurn] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // Instead of a single currentTopic, we store separate topics per player.
  const [currentTopicP1, setCurrentTopicP1] = useState(null);
  const [currentTopicAI, setCurrentTopicAI] = useState(null);
  // Similarly, store separate currentQuestion for each player.
  const [currentQuestionP1, setCurrentQuestionP1] = useState(null);
  const [currentQuestionAI, setCurrentQuestionAI] = useState(null);
  const [degree, setDegree] = useState(1);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState({ "Player 1": 0, "AI Player": 0 });
  const [round, setRound] = useState(1);
  const [masteredCategories, setMasteredCategories] = useState({ "Player 1": [], "AI Player": [] });
  
  // (Optional) Steal state – not used in this version.
  const [stealTurn, setStealTurn] = useState(null);

  // Active player: determined by turn parity.
  const activePlayer = (turn % 2 === 0) ? "Player 1" : "AI Player";

  // Helper getters/setters for the current topic/question of the active player.
  const currentTopicActive = activePlayer === "Player 1" ? currentTopicP1 : currentTopicAI;
  const setCurrentTopicActive = activePlayer === "Player 1" ? setCurrentTopicP1 : setCurrentTopicAI;
  const currentQuestionActive = activePlayer === "Player 1" ? currentQuestionP1 : currentQuestionAI;
  const setCurrentQuestionActive = activePlayer === "Player 1" ? setCurrentQuestionP1 : setCurrentQuestionAI;
  
  // ----------------------------
  // Helper: clearTurnState – resets per-turn selections for the active player.
  // ----------------------------
  const clearTurnState = () => {
    setSelectedCategory(null);
    if (activePlayer === "Player 1") {
      setCurrentTopicP1(null);
      setCurrentQuestionP1(null);
    } else {
      setCurrentTopicAI(null);
      setCurrentQuestionAI(null);
    }
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
    setCurrentQuestionP1(null);
    setCurrentQuestionAI(null);
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
    console.log("Player 1 selects strength:", cat);
    if (player1Strengths.length < 3 && !player1Strengths.includes(cat)) {
      const newStr = [...player1Strengths, cat];
      setPlayer1Strengths(newStr);
      if (newStr.length === 3) {
        setGameState("setup_p1_weakness");
        console.log("Transition to Weakness Selection");
      }
    }
  };

  // ----------------------------
  // Pregame: Player 1 selects 3 weakness categories for AI.
  // ----------------------------
  const handleP1SelectWeakness = (cat) => {
    console.log("Player 1 selects AI weakness:", cat);
    if (player1Weaknesses.length < 3 && !player1Weaknesses.includes(cat)) {
      const newWeak = [...player1Weaknesses, cat];
      setPlayer1Weaknesses(newWeak);
      if (newWeak.length === 3) {
        setGameState("setup_ai");
        console.log("Transition to AI Selection");
      }
    }
  };

  // ----------------------------
  // Pregame: AI auto-selects its strengths and weaknesses independently.
  // ----------------------------
  useEffect(() => {
    if (gameState === "setup_ai" && player1Weaknesses.length === 3) {
      // AI selections are independent (can overlap with Player 1's).
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
      console.log("Transition to Gameplay");
    }
  }, [player1Weaknesses, gameState]);

  // ----------------------------
  // Gameplay: Compute available categories for the active player.
  // ----------------------------
  let availableCategories = [];
  if (gameState === "playing") {
    if (activePlayer === "Player 1") {
      // For Player 1, available = (player1Strengths ∪ aiWeaknesses) minus those already mastered by Player 1.
      availableCategories = [...player1Strengths, ...aiWeaknesses].filter(
        cat => !masteredCategories["Player 1"].includes(cat)
      );
    } else {
      // For AI, available = (aiStrengths ∪ player1Weaknesses) minus those already mastered by AI.
      availableCategories = [...aiStrengths, ...player1Weaknesses].filter(
        cat => !masteredCategories["AI Player"].includes(cat)
      );
    }
    // Fallback: if none available, use all categories.
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
    if (!currentTopicActive) return null;
    const qs = currentTopicActive.degrees?.[deg];
    console.log(`For topic "${currentTopicActive.topic}" (active for ${activePlayer}), degree ${deg}:`, qs);
    return qs && qs.length > 0 ? qs[Math.floor(Math.random() * qs.length)] : null;
  };

  // ----------------------------
  // useEffect: When currentTopicActive or degree changes, fetch a new question (with 100ms delay).
  // ----------------------------
  useEffect(() => {
    if (gameState === "playing" && selectedCategory && currentTopicActive && degree) {
      const timer = setTimeout(() => {
        const q = getQuestion(degree);
        if (q) {
          setCurrentQuestionActive(q);
          console.log("Fetched question for", activePlayer, "Degree", degree, ":", q);
        } else {
          setFeedback(`No questions for "${currentTopicActive.topic}" at Degree ${degree}. Turn passes.`);
          clearTurnState();
          setTurn(prev => prev + 1);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentTopicActive, degree, selectedCategory, gameState, activePlayer]);

  // ----------------------------
  // handleSelectCategory: When a category is chosen, clear previous turn state and select a random topic for the active player.
  // ----------------------------
  const handleSelectCategory = (cat) => {
    console.log("handleSelectCategory called for", activePlayer, "with:", cat);
    clearTurnState();
    setSelectedCategory(cat);
    setDegree(1);
    const topics = questions[cat]; // using trivia questions here.
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
    setCurrentTopicActive(chosenTopic);
    setCurrentQuestionActive(q);
    setFeedback('');
    setAnswer('');
    console.log(activePlayer, "selected category:", cat, "and got topic:", chosenTopic.topic, "with question:", q);
  };

  // ----------------------------
  // handleSubmitAnswer: Process answer submission for the active player.
  // ----------------------------
  const handleSubmitAnswer = (providedAnswer) => {
    const userAnswer = providedAnswer !== undefined ? providedAnswer : answer;
    let isCorrect = false;
    if (activePlayer === "Player 1") {
      if (currentQuestionActive) {
        if (currentQuestionActive.type === "fill") {
          isCorrect = isAnswerAcceptable(
            userAnswer,
            Array.isArray(currentQuestionActive.answer)
              ? currentQuestionActive.answer[0]
              : currentQuestionActive.answer
          );
        } else {
          isCorrect = Array.isArray(currentQuestionActive.answer)
            ? currentQuestionActive.answer.some(a => a.trim().toLowerCase() === userAnswer.trim().toLowerCase())
            : userAnswer.trim().toLowerCase() === currentQuestionActive.answer.trim().toLowerCase();
        }
      }
    } else {
      isCorrect = Math.random() < 0.7;
    }
    
    if (isCorrect) {
      console.log(activePlayer, "answered correctly.");
      let basePoints = degree * 10;
      if (currentQuestionActive.type === "fill") basePoints *= 2;
      const bonus = activePlayer === "Player 1"
        ? (player1Weaknesses.includes(selectedCategory) ? 10 : 0)
        : (aiWeaknesses.includes(selectedCategory) ? 10 : 0);
      const totalPoints = basePoints + bonus;
      setScore(prev => ({ ...prev, [activePlayer]: prev[activePlayer] + totalPoints }));
      console.log(activePlayer, "earns", totalPoints, "points.");
      if (degree < 3) {
        setDegree(prev => prev + 1);
      } else {
        setFeedback(`${activePlayer} has mastered ${selectedCategory} for topic "${currentTopicActive.topic}"!`);
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
          {selectedCategory && currentQuestionActive && (
            <>
              <h3>
                Category: {selectedCategory} - Topic: {activePlayer === "Player 1" ? currentTopicP1.topic : currentTopicAI.topic} - Degree {degree}
              </h3>
              <p>{currentQuestionActive.question}</p>
              {activePlayer === "Player 1" ? (
                currentQuestionActive.type === "mc" ? (
                  <>
                    {currentQuestionActive.choices.map((choice, index) => (
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
