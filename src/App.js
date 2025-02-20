import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';

// Helper function for answer tolerance (85% letter match for fill-type answers)
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
  const ratio = match / correctStr.length;
  return ratio >= 0.85;
}

const allCategories = [
  "History", "Science", "Geography", "Math", "Literature", "Sports",
  "Music", "Art", "Technology", "Politics", "Movies", "Travel"
];

function App() {
  // Game phases: "setup_p1_strength", "setup_p1_weakness", "setup_ai", "playing"
  const [gameState, setGameState] = useState("setup_p1_strength");
  const [player1Strengths, setPlayer1Strengths] = useState([]);
  const [player1Weaknesses, setPlayer1Weaknesses] = useState([]);
  const [aiStrengths, setAiStrengths] = useState([]);
  const [aiWeaknesses, setAiWeaknesses] = useState([]);
  
  // In-game state
  const [turn, setTurn] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null); // Chosen topic for the selected category
  const [degree, setDegree] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState({ "Player 1": 0, "AI Player": 0 });
  const [round, setRound] = useState(1);
  const [masteredCategories, setMasteredCategories] = useState({ "Player 1": [], "AI Player": [] });

  const currentPlayer = turn % 2 === 0 ? "Player 1" : "AI Player";

  // ----------------------------
  // Pregame Setup: Player 1 selects 3 strengths.
  // ----------------------------
  const handleP1SelectStrength = (cat) => {
    console.log("handleP1SelectStrength called with:", cat);
    if (player1Strengths.length < 3 && !player1Strengths.includes(cat)) {
      const newStrengths = [...player1Strengths, cat];
      setPlayer1Strengths(newStrengths);
      console.log("Updated Player 1 Strengths:", newStrengths);
      if (newStrengths.length === 3) {
        setGameState("setup_p1_weakness");
        console.log("Transitioning to setup_p1_weakness");
      }
    }
  };

  // ----------------------------
  // Pregame Setup: Player 1 selects 3 weaknesses for the AI.
  // ----------------------------
  const handleP1SelectWeakness = (cat) => {
    console.log("handleP1SelectWeakness called with:", cat);
    if (player1Weaknesses.length < 3 && !player1Weaknesses.includes(cat)) {
      const newWeaknesses = [...player1Weaknesses, cat];
      setPlayer1Weaknesses(newWeaknesses);
      console.log("Updated Player 1 Weaknesses:", newWeaknesses);
      if (newWeaknesses.length === 3) {
        setGameState("setup_ai");
        console.log("Transitioning to setup_ai");
      }
    }
  };

  // ----------------------------
  // Pregame Setup: AI auto-selects its strengths and assigns weaknesses for Player 1.
  // ----------------------------
  useEffect(() => {
    if (gameState === "setup_ai") {
      const remaining = allCategories.filter(cat => !player1Strengths.includes(cat));
      console.log("AI setup remaining categories:", remaining);
      if (aiStrengths.length < 3) {
        setAiStrengths(remaining.slice(0, 3));
        console.log("AI Strengths set to:", remaining.slice(0, 3));
      }
      if (aiWeaknesses.length < 3) {
        setAiWeaknesses(remaining.slice(3, 6));
        console.log("AI Weaknesses set to:", remaining.slice(3, 6));
      }
      if (aiStrengths.length >= 3 && aiWeaknesses.length >= 3) {
        setGameState("playing");
        console.log("Transitioning to playing phase");
      }
    }
  }, [gameState, player1Strengths, aiStrengths, aiWeaknesses]);

  // ----------------------------
  // In-game: Determine available categories.
  // For Player 1: union of (player1Strengths) and (aiWeaknesses).
  // For AI: union of (aiStrengths) and (player1Weaknesses).
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
    console.log("Available categories for", currentPlayer, ":", availableCategories);
  }

  // ----------------------------
  // getQuestion: Retrieve a question for the currentTopic at a given degree.
  // ----------------------------
  const getQuestion = (deg) => {
    if (!currentTopic) return null;
    const qs = currentTopic.degrees?.[deg];
    console.log(`For topic "${currentTopic.topic}", degree ${deg}:`, qs);
    return qs && qs.length > 0 ? qs[Math.floor(Math.random() * qs.length)] : null;
  };

  // When a category is selected, choose a topic that has valid Degree 1 questions.
  const handleSelectCategory = (cat) => {
    console.log("handleSelectCategory called with:", cat);
    setSelectedCategory(cat);
    setDegree(1);
    const topics = questions[cat];
    if (!topics || topics.length === 0) {
      setFeedback(`No topics available for ${cat}. Please select a different category.`);
      setSelectedCategory(null);
      return;
    }
    let chosenTopic = null;
    let q = null;
    for (let i = 0; i < topics.length; i++) {
      const topicCandidate = topics[i];
      if (topicCandidate.degrees && topicCandidate.degrees[1] && topicCandidate.degrees[1].length > 0) {
        chosenTopic = topicCandidate;
        q = topicCandidate.degrees[1][Math.floor(Math.random() * topicCandidate.degrees[1].length)];
        break;
      }
    }
    if (!q) {
      setFeedback(`No valid Degree 1 questions available for ${cat}. Please select a different category.`);
      setSelectedCategory(null);
      setCurrentTopic(null);
      return;
    }
    setCurrentTopic(chosenTopic);
    setCurrentQuestion(q);
    setFeedback('');
    setAnswer('');
    console.log("Selected category:", cat, "Chosen topic:", chosenTopic.topic, "Question:", q);
  };

  // ----------------------------
  // useEffect: Fetch new question when currentTopic or degree changes.
  // ----------------------------
  useEffect(() => {
    if (gameState === "playing" && selectedCategory && currentTopic && degree) {
      const q = getQuestion(degree);
      if (q) {
        setCurrentQuestion(q);
        console.log(`New question fetched for degree ${degree}:`, q);
      } else {
        console.error(`No question found for topic "${currentTopic.topic}" at degree ${degree}`);
        setFeedback(`No questions available for "${currentTopic.topic}" at Degree ${degree}. Turn passes.`);
        setSelectedCategory(null);
        setCurrentTopic(null);
        setTurn(turn + 1);
        if (currentPlayer === "AI Player") setRound(round + 1);
      }
    }
  }, [currentTopic, degree, selectedCategory, gameState, currentPlayer, round, turn]);

  // ----------------------------
  // Answer submission and steal mechanism.
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
          isCorrect = answer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
        }
      }
    } else {
      isCorrect = Math.random() < 0.7;
    }

    if (isCorrect) {
      setFeedback(`${currentPlayer} answered correctly!`);
      let basePoints = degree * 10;
      if (currentQuestion.type === "fill") {
        basePoints *= 2; // Double points for fill-in answers.
      }
      if (currentPlayer === "Player 1") {
        basePoints += aiWeaknesses.includes(selectedCategory) ? 20 : 10;
      } else {
        basePoints += player1Weaknesses.includes(selectedCategory) ? 20 : 10;
      }
      setScore(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + basePoints }));
      if (degree < 3) {
        const newDegree = degree + 1;
        setDegree(newDegree);
      } else {
        setFeedback(`${currentPlayer} has mastered ${selectedCategory} for topic "${currentTopic.topic}"!`);
        setMasteredCategories(prev => ({
          ...prev,
          [currentPlayer]: [...prev[currentPlayer], selectedCategory]
        }));
        setSelectedCategory(null);
        setCurrentTopic(null);
        setTurn(turn + 1);
        if (currentPlayer === "AI Player") setRound(round + 1);
      }
    } else {
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
        } else {
          setFeedback(`${opponent} has mastered ${selectedCategory} by stealing!`);
          setMasteredCategories(prev => ({
            ...prev,
            [opponent]: [...prev[opponent], selectedCategory]
          }));
          setSelectedCategory(null);
          setCurrentTopic(null);
          setTurn(turn + 1);
          if (opponent === "AI Player") setRound(round + 1);
        }
      } else {
        setFeedback(`${currentPlayer} answered incorrectly! Turn passes.`);
        setSelectedCategory(null);
        setCurrentTopic(null);
        setTurn(turn + 1);
        if (currentPlayer === "AI Player") setRound(round + 1);
      }
    }
    setAnswer('');
  };

  // ----------------------------
  // Game Over Condition: Check only during "playing" state.
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
          {currentPlayer === "Player 1" && !selectedCategory && (
            <>
              <h3>Select a Category to Play (from your 6 available categories):</h3>
              {availableCategories.map(cat => (
                <button key={cat} onClick={() => { console.log("handleSelectCategory called for:", cat); handleSelectCategory(cat); }}>
                  {cat}
                </button>
              ))}
            </>
          )}
          {currentPlayer === "AI Player" && !selectedCategory && (
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
                      <button key={index} onClick={() => { console.log("MC choice selected:", choice); setAnswer(choice); handleSubmitAnswer(); }}>
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
          <p>Mastered - Player 1: {masteredCategories["Player 1"].join(", ")}</p>
          <p>Mastered - AI Player: {masteredCategories["AI Player"].join(", ")}</p>
        </>
      )}
    </div>
  );
}

export default App;
