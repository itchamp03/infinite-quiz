import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import allQuestions from "./questions.json"; // Import the JSON file

const QuestionCard = ({ questionData, onAnswer }) => {
  const [selected, setSelected] = useState(null);

  const handleClick = (option) => {
    if (selected === null) {
      setSelected(option);
      setTimeout(() => onAnswer(), 1000); // Automatically move to the next question after 1 second
    }
  };

  return (
    <div className="question-card">
      <h3 className="question">{questionData.question}</h3>
      <div className="options">
        {questionData.options.map((option, i) => {
          const isCorrect = option === questionData.answer;
          const isSelected = option === selected;
          const optionClass = isSelected
            ? isCorrect
              ? "option selected correct"
              : "option selected incorrect"
            : "option";

          return (
            <div
              key={i}
              className={optionClass}
              onClick={() => handleClick(option)}
            >
              {option}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef();

  const handleAnswer = () => {
    if (currentIndex + 1 < allQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    // Scroll to the current question
    containerRef.current.style.transform = `translateY(-${currentIndex * 100}vh)`;
  }, [currentIndex]);

  return (
    <div className="app">
      <div className="questions-container" ref={containerRef}>
        {allQuestions.map((q, index) => (
          <div key={q.id} className="question-slide">
            <QuestionCard questionData={q} onAnswer={handleAnswer} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;