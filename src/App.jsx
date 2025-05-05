import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import allQuestions from "./questions.json"; // Import the JSON file

const QuestionCard = ({ questionData, onAnswer }) => {
  const [selected, setSelected] = useState(null);

  const handleClick = (option) => {
    if (selected === null) {
      setSelected(option);
      onAnswer(); // Trigger the scroll to the next question
    }
  };

  return (
    <div className="question-card">
      <h3>{questionData.question}</h3>
      {questionData.options.map((option, i) => {
        const isCorrect = option === questionData.answer;
        const isSelected = option === selected;
        const optionClass = isSelected
          ? isCorrect
            ? "option selected"
            : "option incorrect"
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
  );
};

const App = () => {
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Add a loading flag
  const loadCount = 3;
  const loaderRef = useRef();
  const questionRefs = useRef([]); // Array of refs for each question

  useEffect(() => {
    setVisibleQuestions(allQuestions.slice(0, loadCount));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMoreQuestions();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [visibleQuestions, isLoading]); // Add isLoading to the dependency array

  const loadMoreQuestions = () => {
    setIsLoading(true); // Set loading to true
    const currentCount = visibleQuestions.length;
    const more = allQuestions.slice(currentCount, currentCount + loadCount);
    if (more.length > 0) {
      setVisibleQuestions((prev) => [...prev, ...more]);
    }
    setIsLoading(false); // Reset loading after updating
  };

  const handleAnswer = (index) => {
    // Scroll to the next question
    if (index + 1 < questionRefs.current.length) {
      questionRefs.current[index + 1].scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container">
      <h1>🧠 Infinite Quiz</h1>
      {visibleQuestions.map((q, index) => (
        <div
          key={q.id}
          ref={(el) => (questionRefs.current[index] = el)} // Assign ref to each question
        >
          <QuestionCard questionData={q} onAnswer={() => handleAnswer(index)} />
        </div>
      ))}
      <div ref={loaderRef} className="loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default App;