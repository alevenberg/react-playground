import logo from './logo.svg';
import './App.css';
import { useState } from 'react';


const question = {
  prompt: "What color is the sky?",
  correctAnswer: "blue",
  answers: [
    "Red",
    "Blue",
    "Green",
    "Yellow"
  ]
};

function App() {
  const [questions, setQuestions] = useState([]);

  return (
    <div className="App">
      <h1> Quiz</h1>
      <h2>{question.prompt}</h2>
    </div>
  );
}

export default App;
