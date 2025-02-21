import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { questions } from "../data/questions";

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const navigate = useNavigate();

  const currentQuestion = questions[currentQuestionIndex];

  // Timer logic
  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Handle MCQ answer selection
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.answer) {
      setScore(score + 1);
    }
  };

  // Handle written answer submission
  const handleWrittenAnswerSubmit = () => {
    if (
      writtenAnswer.trim().toLowerCase() ===
      currentQuestion.answer.toLowerCase()
    ) {
      setScore(score + 1);
    }
    handleNextQuestion();
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setWrittenAnswer("");
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
    }
  };

  // Redirect to result page after quiz completion
  useEffect(() => {
    if (quizCompleted) {
      localStorage.setItem("quizScore", score);
      navigate("/result");
    }
  }, [quizCompleted, navigate, score]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Quiz</h2>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">
          {currentQuestion.question}
        </h3>

        {/* Render MCQ Options */}
        {currentQuestion.type === "mcq" && (
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`w-full px-4 py-2 border rounded-lg ${
                  selectedAnswer
                    ? option === currentQuestion.answer
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Render Written Answer Input */}
        {currentQuestion.type === "written" && (
          <div className="mt-4">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your answer..."
              value={writtenAnswer}
              onChange={(e) => setWrittenAnswer(e.target.value)}
            />
            <button
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={handleWrittenAnswerSubmit}
              disabled={writtenAnswer.trim() === ""}
            >
              Submit Answer
            </button>
          </div>
        )}

        <p className="mt-4">
          Time Left: <span className="font-bold">{timeLeft}s</span>
        </p>

        {/* Next Question Button (Only for MCQ) */}
        {currentQuestion.type === "mcq" && (
          <button
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={handleNextQuestion}
            disabled={!selectedAnswer && timeLeft > 0}
          >
            {currentQuestionIndex < questions.length - 1
              ? "Next Question"
              : "Finish Quiz"}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
