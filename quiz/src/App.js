import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

// Display a quiz and click through
const question = {
  prompt: "What color is the sky?",
  correctAnswer: "Blue",
  answers: [
    "Red",
    "Blue",
    "Green",
    "Yellow"
  ]
};

function App() {
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState();
  const [result, setResult] = useState();

  const handleChange = (event) => {
    setAnswer(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (answer === question.correctAnswer) {
      setResult("Correct");
    } else {
      setResult("Incorrect");
    }
  }

  return (
    <div className="App">
      <h1> Quiz</h1>
      <h2>{question.prompt}</h2>
      <form onSubmit={handleSubmit}>
        <select value={answer} onChange={handleChange}>
          {question.answers.map((a) => (<option value={a}> {a}</option>))}
        </select>
        <input type="submit" />
      </form>
      <div>{result}</div>
    </div>
  );
}

export default App;
