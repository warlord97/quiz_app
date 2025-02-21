import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizHistory, saveQuizAttempt } from "../utils/indexedDB";

const ResultPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const score = localStorage.getItem("quizScore");

  useEffect(() => {
    const fetchHistory = async () => {
      const previousHistory = await getQuizHistory();
      setHistory(previousHistory);
    };

    const saveAttemptIfNeeded = async () => {
      if (!score) return;

      // Fetch history first
      const previousHistory = await getQuizHistory();
      setHistory(previousHistory);

      // Get the last attempt
      const lastAttempt =
        previousHistory.length > 0
          ? previousHistory[previousHistory.length - 1]
          : null;

      // Save only if the last score is different
      if (!lastAttempt || lastAttempt.score !== score) {
        const attemptData = {
          score: score,
          date: new Date().toLocaleString(),
        };
        await saveQuizAttempt(attemptData);
        fetchHistory(); // Fetch updated history after saving
        localStorage.setItem("scoreSaved", score);
      }
    };

    fetchHistory(); // Fetch on mount
    saveAttemptIfNeeded(); // Save if needed
  }, []); // Run only once when component mounts

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
      <p className="text-lg mb-4">
        Your Score: <span className="font-bold">{score}</span>
      </p>

      <h3 className="text-2xl font-semibold mt-6 mb-3">Attempt History</h3>

      {/* Scrollable History List */}
      <div className="w-full max-w-md h-64 overflow-y-auto bg-white p-4 rounded-lg shadow-lg border">
        {history.length > 0 ? (
          <ul>
            {history.map((attempt, index) => (
              <li key={index} className="py-2 border-b last:border-none">
                <span className="font-semibold">Score:</span> {attempt.score} -{" "}
                <span className="font-semibold">Date:</span> {attempt.date}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No previous attempts.</p>
        )}
      </div>

      <button
        className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        onClick={() => navigate("/quiz")}
      >
        Retake Quiz
      </button>

      <button
        className="mt-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
};

export default ResultPage;
