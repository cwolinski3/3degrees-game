import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';

// Helper: returns true if the user's answer is at least 85% similar to the correct answer.
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
  // Game phases.
  const [gameState, setGameState] = useState("setup_p1_strength");
  const [player1Strengths, setPlayer1Strengths] = useState([]);
  const [player1Weaknesses, setPlayer1Weaknesses] = useState([]);
  const [aiStrengths, setAiStrengths] = useState([]);
  const [aiWeaknesses, setAiWeaknesses] = useState([]);

  // In-game state.
  const [turn, setTurn] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null); // Fixed topic for chosen category.
  const [degree, setDegree] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState({ "Player 1": 0, "AI Player": 0 });
  const [round, setRound] = useState(1);
  const [masteredCategories, setMasteredCategories] = useState({ "Player 1": [], "AI Player": [] });
  
  // New state for steal turns.
  const [stealTurn, setStealTurn] = useState(null);

  // Determine current player: if stealTurn is active, use that; otherwise, use turn parity.
  const currentPlayer = stealTurn ? stealTurn : (turn % 2 === 0 ? "Player 1" : "AI Player");

  // ----------------------------
  // clearTurnState: Resets per-turn state variables.
  // ----------------------------
  const clearTurnState = () => {
    setSelectedCategory(null);
    setCurrentTopic(null);
    setDegree(1);
    setStealTurn(null);
  };

  // ----------------------------
  // resetGame: Resets all game state for a new game.
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
  // In-game: Determine available categories.
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
    console.log("Available for", currentPlayer, ":", availableCategories);
  }

  // ----------------------------
  // getQuestion: Pull a random question from currentTopic for a given degree.
  // ----------------------------
  const getQuestion = (deg) => {
    if (!currentTopic) return null;
    const qs = currentTopic.degrees?.[deg];
    console.log(`For topic "${currentTopic.topic}", degree ${deg}:`, qs);
    return qs && qs.length > 0 ? qs[Math.floor(Math.random() * qs.length)] : null;
  };

  // ----------------------------
  // handleSelectCategory: When a category is chosen, pick a random topic with valid Degree 1 questions.
  // ----------------------------
  const handleSelectCategory = (cat) => {
    console.log("handleSelectCategory called with:", cat);
    setSelectedCategory(cat);
    setDegree(1);
    const topics = questions[cat];
    if (!topics || topics.length === 0) {
      setFeedback(`No topics available for ${cat}. Please select a different category.`);
      clearTurnState();
      return;
    }
    const validTopics = topics.filter(topic => topic.degrees && topic.degrees[1] && topic.degrees[1].length > 0);
    if (validTopics.length === 0) {
      setFeedback(`No valid Degree 1 questions for ${cat}. Please select a different category.`);
      clearTurnState();
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
  // useEffect: When currentTopic or degree changes (and not in steal mode), fetch a new question.
  // ----------------------------
  useEffect(() => {
    if (gameState === "playing" && selectedCategory && currentTopic && degree && !stealTurn) {
      const q = getQuestion(degree);
      if (q) {
        setCurrentQuestion(q);
        console.log(`Fetched new question for degree ${degree}:`, q);
      } else {
        console.error(`No question for topic "${currentTopic.topic}" at degree ${degree}`);
        setFeedback(`No questions available for "${currentTopic.topic}" at Degree ${degree}. Turn passes.`);
        clearTurnState();
        setTurn(turn + 1);
        if (currentPlayer === "AI Player") setRound(round + 1);
      }
    }
  }, [currentTopic, degree, selectedCategory, gameState, currentPlayer, round, turn, stealTurn]);

  // ----------------------------
  // handleStealCategory: For off-turn player (Player 1) to choose a category for the steal attempt.
  // ----------------------------
  const handleStealCategory = (cat) => {
    console.log("handleStealCategory called with:", cat);
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
    setFeedback("Steal attempt: Answer the new Degree 1 question.");
    // Force the steal turn to remain for Player 1.
    setStealTurn("Player 1");
    console.log("Steal category selected:", cat, "Chosen topic:", chosenTopic.topic, "Question:", q);
  };

  // ----------------------------
  // handleSubmitAnswer: Processes answer submission.
  // If in steal turn, treat it as the off-turn player's steal attempt.
  // ----------------------------
  const handleSubmitAnswer = (providedAnswer) => {
    const userAnswer = providedAnswer !== undefined ? providedAnswer : answer;
    let isCorrect = false;

    // If in steal turn, process the steal attempt.
    if (stealTurn) {
      if (currentQuestion.type === "fill") {
        isCorrect = isAnswerAcceptable(
          userAnswer,
          Array.isArray(currentQuestion.answer) ? currentQuestion.answer[0] : currentQuestion.answer
        );
      } else {
        if (Array.isArray(currentQuestion.answer)) {
          isCorrect = currentQuestion.answer.some(a => a.trim().toLowerCase() === userAnswer.trim().toLowerCase());
        } else {
          isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
        }
      }
      if (isCorrect) {
        console.log("Steal attempt correct! Player 1 steals successfully.");
        let basePoints = degree * 10;
        if (currentQuestion.type === "fill") basePoints *= 2;
        const bonus = player1Weaknesses.includes(selectedCategory) ? 20 : 10;
        basePoints += bonus;
        console.log(`Steal correct: Player 1 gets base=${degree*10}, bonus=${bonus}, total=${basePoints}`);
        setScore(prev => ({ ...prev, ["Player 1"]: prev["Player 1"] + basePoints }));
        // Successful steal: clear steal turn and progress.
        setStealTurn(null);
        if (degree < 3) {
          setDegree(degree + 1);
        } else {
          console.log(`Player 1 has mastered ${selectedCategory} by stealing!`);
          setFeedback(`Player 1 has mastered ${selectedCategory} by stealing!`);
          setMasteredCategories(prev => ({
            ...prev,
            ["Player 1"]: [...prev["Player 1"], selectedCategory]
          }));
          clearTurnState();
          setTurn(turn + 1);
          setRound(round + 1);
        }
      } else {
        console.log("Steal attempt failed. Player 1 answered incorrectly on steal.");
        let stealPoints = degree * 10;
        if (currentQuestion.type === "fill") stealPoints *= 2;
        const bonus = player1Weaknesses.includes(selectedCategory) ? 20 : 10;
        stealPoints += bonus;
        console.log(`Steal failed: Player 1 gets steal points=${stealPoints}`);
        setScore(prev => ({ ...prev, ["Player 1"]: prev["Player 1"] + stealPoints }));
        setFeedback(`Steal failed: You get ${stealPoints} points. Turn passes.`);
        clearTurnState();
        setTurn(turn + 1);
        setRound(round + 1);
      }
      setAnswer('');
      return;
    }

    // Normal answer processing.
    if (currentPlayer === "Player 1") {
      if (currentQuestion) {
        if (currentQuestion.type === "fill") {
          isCorrect = isAnswerAcceptable(
            userAnswer,
            Array.isArray(currentQuestion.answer) ? currentQuestion.answer[0] : currentQuestion.answer
          );
        } else {
          if (Array.isArray(currentQuestion.answer)) {
            isCorrect = currentQuestion.answer.some(a => a.trim().toLowerCase() === userAnswer.trim().toLowerCase());
          } else {
            isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
          }
        }
      }
    } else {
      isCorrect = Math.random() < 0.7;
    }

    if (isCorrect) {
      console.log(`${currentPlayer} answered correctly!`);
      let basePoints = degree * 10;
      if (currentQuestion.type === "fill") basePoints *= 2;
      const bonus = currentPlayer === "Player 1"
        ? (player1Weaknesses.includes(selectedCategory) ? 20 : 10)
        : (aiWeaknesses.includes(selectedCategory) ? 20 : 10);
      basePoints += bonus;
      console.log(`Correct: ${currentPlayer} gets base=${degree*10}, bonus=${bonus}, total=${basePoints}`);
      setScore(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + basePoints }));
      if (degree < 3) {
        setDegree(degree + 1);
      } else {
        console.log(`${currentPlayer} has mastered ${selectedCategory} for topic "${currentTopic.topic}"!`);
        setFeedback(`${currentPlayer} has mastered ${selectedCategory} for topic "${currentTopic.topic}"!`);
        setMasteredCategories(prev => ({
          ...prev,
          [currentPlayer]: [...prev[currentPlayer], selectedCategory]
        }));
        clearTurnState();
        setTurn(turn + 1);
        if (currentPlayer === "AI Player") setRound(round + 1);
      }
    } else {
      console.log(`${currentPlayer} answered incorrectly.`);
      // If active player is AI, give off-turn (Player 1) a steal opportunity.
      if (currentPlayer === "AI Player") {
        console.log("AI missed. Steal opportunity for Player 1.");
        setFeedback("AI answered incorrectly! Player 1, select a category to steal from.");
        setStealTurn("Player 1");
        // Do not clear turn state so that Player 1 can now choose a steal category.
      } else {
        // If active player is Player 1, simulate AI steal automatically.
        console.log("Player 1 missed. AI will attempt to steal.");
        const oppCorrect = Math.random() < 0.7;
        if (oppCorrect) {
          console.log("AI answered correctly on steal!");
          let basePoints = degree * 10;
          if (currentQuestion.type === "fill") basePoints *= 2;
          const bonus = aiWeaknesses.includes(selectedCategory) ? 20 : 10;
          basePoints += bonus;
          console.log(`Steal correct: AI gets base=${degree*10}, bonus=${bonus}, total=${basePoints}`);
          setScore(prev => ({ ...prev, ["AI Player"]: prev["AI Player"] + basePoints }));
          if (degree < 3) {
            setDegree(degree + 1);
          } else {
            console.log("AI has mastered", selectedCategory, "by stealing!");
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
          const bonus = aiWeaknesses.includes(selectedCategory) ? 20 : 10;
          stealPoints += bonus;
          console.log(`AI failed on steal: gets steal points=${stealPoints}`);
          setScore(prev => ({ ...prev, ["AI Player"]: prev["AI Player"] + stealPoints }));
          setFeedback(`AI failed on steal and gets ${stealPoints} points. Turn passes.`);
          clearTurnState();
          setTurn(turn + 1);
          setRound(round + 1);
        }
      }
    }
    setAnswer('');
  };

  // ----------------------------
  // Game Over Condition.
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
      let winReason = "";
      if (masteredCategories["Player 1"].length === totalCategoriesForPlayer ||
          masteredCategories["AI Player"].length === totalCategoriesForPlayer) {
        winReason = "by Mastery";
      } else {
        winReason = "by Total Points Scored";
      }
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

  // ----------------------------
  // Render UI.
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
          <h2>Round: {round} - {currentPlayer}'s Turn</h2>
          {stealTurn === "Player 1" && (
            <div>
              <h3>Steal Opportunity! Select a Category to Steal From:</h3>
              {availableCategories.map(cat => (
                <button key={cat} onClick={() => { console.log("Steal category selected:", cat); handleStealCategory(cat); }}>
                  {cat}
                </button>
              ))}
            </div>
          )}
          {(!selectedCategory && !stealTurn) && currentPlayer === "Player 1" && (
            <>
              <h3>Select a Category to Play (from your available categories):</h3>
              {availableCategories.map(cat => (
                <button key={cat} onClick={() => { console.log("handleSelectCategory called for:", cat); handleSelectCategory(cat); }}>
                  {cat}
                </button>
              ))}
            </>
          )}
          {(!selectedCategory && !stealTurn) && currentPlayer === "AI Player" && (
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
              {currentPlayer === "Player 1" ? (
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
          <p>Mastered - Player 1: {masteredCategories["Player 1"].join(", ")}</p>
          <p>Mastered - AI Player: {masteredCategories["AI Player"].join(", ")}</p>
        </>
      )}
    </div>
  );
}

export default App;
