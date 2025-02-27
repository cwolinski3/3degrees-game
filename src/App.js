import React, { useState, useEffect } from 'react';
// Use named imports for the questions.
import { questions as triviaQuestions } from './data/questions';
import { questions as educationQuestions } from './data/educationQuestions';

// Dummy fallback data in case the imported data files are empty.
const dummyData = {
  "History": [
    {
      topic: "Dummy History Topic",
      degrees: {
        1: [
          { type: "mc", question: "What is history?", choices: ["History", "Science"], answer: "History", bonus: 5 }
        ],
        2: [
          { type: "fill", question: "Who wrote history?", answer: ["Herodotus"], bonus: 10 }
        ],
        3: [
          { type: "mc", question: "Why study history?", choices: ["For knowledge", "For fun"], answer: "For knowledge", bonus: 5 }
        ]
      }
    }
  ],
  "Science": [
    {
      topic: "Dummy Science Topic",
      degrees: {
        1: [
          { type: "mc", question: "What is science?", choices: ["Study of nature", "Magic"], answer: "Study of nature", bonus: 5 }
        ],
        2: [
          { type: "fill", question: "Name one branch of science.", answer: ["Physics", "Chemistry", "Biology"], bonus: 10 }
        ],
        3: [
          { type: "mc", question: "Why do scientists experiment?", choices: ["To learn", "For fun"], answer: "To learn", bonus: 5 }
        ]
      }
    }
  ]
  // (Add dummy entries for other categories as needed)
};

function App() {
  // --- Mode selection ---
  const [mode, setMode] = useState(null); // "trivia" or "education"

  // --- Game phase state ---
  const [gameState, setGameState] = useState("setup_p1_strength");
  const [player1Strengths, setPlayer1Strengths] = useState([]);
  const [player1Weaknesses, setPlayer1Weaknesses] = useState([]);
  const [aiStrengths, setAiStrengths] = useState([]);
  const [aiWeaknesses, setAiWeaknesses] = useState([]);

  // --- In-game state ---
  const [turn, setTurn] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null); // Topic fixed for current turn.
  const [degree, setDegree] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState({ "Player 1": 0, "AI Player": 0 });
  const [round, setRound] = useState(1);
  const [masteredCategories, setMasteredCategories] = useState({ "Player 1": [], "AI Player": [] });
  
  // --- Steal state ---
  // When non-null, forces a steal opportunity for the off-turn (Player 1).
  const [stealTurn, setStealTurn] = useState(null);

  // Determine active player: if stealTurn is active, that player is active; otherwise, use turn parity.
  const activePlayer = stealTurn ? stealTurn : (turn % 2 === 0 ? "Player 1" : "AI Player");

  // --- Data source ---
  // Use the educationQuestions if mode is "education", otherwise use triviaQuestions.
  // Fallback to dummyData if the chosen data source is empty.
  const rawData = mode === "education" ? educationQuestions : triviaQuestions;
  const dataSource = (rawData && Object.keys(rawData).length > 0) ? rawData : dummyData;

  // --- Helper: clearTurnState ---
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

  // --- Mode Selection Screen ---
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

  // --- Pregame: Player 1 selects 3 strengths ---
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

  // --- Pregame: Player 1 selects 3 weaknesses for AI ---
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

  // --- Pregame: AI auto-selects its strengths and weaknesses ---
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

  // --- In-game: Determine available categories for active player ---
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

  // --- getQuestion: Return a random question from currentTopic for a given degree ---
  const getQuestion = (deg) => {
    if (!currentTopic) return null;
    const qs = currentTopic.degrees?.[deg];
    console.log(`For topic "${currentTopic.topic}", degree ${deg}:`, qs);
    return qs && qs.length > 0 ? qs[Math.floor(Math.random() * qs.length)] : null;
  };

  // --- handleSelectCategory: When a category is chosen, clear previous state and pick a new random topic ---
  const handleSelectCategory = (cat) => {
    console.log("handleSelectCategory called with:", cat);
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
    console.log("Selected category:", cat, "Chosen topic:", chosenTopic.topic, "Question:", q);
  };

  // --- useEffect: When currentTopic or degree changes (and not in a steal turn), fetch a new question ---
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
        if (activePlayer === "AI Player") setRound(round + 1);
      }
    }
  }, [currentTopic, degree, selectedCategory, gameState, activePlayer, round, turn, stealTurn]);

  // --- handleStealCategory: For Player 1 (off-turn) to select a new category for steal ---
  const handleStealCategory = (cat) => {
    console.log("handleStealCategory called with:", cat);
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
    // Force stealTurn to remain for Player 1.
    setStealTurn("Player 1");
    console.log("Steal category selected:", cat, "Chosen topic:", chosenTopic.topic, "Question:", q);
  };

  // --- handleSubmitAnswer: Process answer submission.
  // If stealTurn is active, process as a steal attempt.
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
        if (Array.isArray(currentQuestion.answer)) {
          isCorrect = currentQuestion.answer.some(a => a.trim().toLowerCase() === userAnswer.trim().toLowerCase());
        } else {
          isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
        }
      }
      if (isCorrect) {
        console.log("Steal attempt correct! Player 1 answers correctly on steal.");
        // Award double points for this steal question.
        let basePoints = degree * 10;
        if (currentQuestion.type === "fill") basePoints *= 2;
        const bonus = player1Weaknesses.includes(selectedCategory) ? 10 : 0;
        const stealPoints = 2 * (basePoints + bonus);
        console.log(`Steal correct: Player 1 earns ${stealPoints} points (double for steal).`);
        setScore(prev => ({ ...prev, ["Player 1"]: prev["Player 1"] + stealPoints }));
        // Successful steal: Player 1 retains their turn and continues in the category.
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
          // Player 1 retains turn to choose a new category.
        }
      } else {
        console.log("Steal attempt failed. Player 1 answered incorrectly on steal.");
        let stealPoints = degree * 10;
        if (currentQuestion.type === "fill") stealPoints *= 2;
        const bonus = player1Weaknesses.includes(selectedCategory) ? 10 : 0;
        stealPoints += bonus;
        console.log(`Steal failed: Player 1 earns ${stealPoints} points.`);
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
      console.log(`${activePlayer} answered correctly!`);
     
