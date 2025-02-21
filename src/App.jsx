import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </div>
  );
};

export default App;
