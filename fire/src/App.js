import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Fire Calculator</h1>
      <form className='fire-calc-form'>
        <label> Age
          <input type="number" />
        </label>
        <label> Current investment balance
          <input type="number" />
        </label>

        <label> Annual retirement expenses
          <input type="number" />
        </label>
        <label> Regular contributions
          <input type="number" />
        </label>
        <label> Contritbution frequency
          <select>
            <option value="Monthly"> Monthly</option>
            <option value="Annually"> Annually</option>
          </select>
        </label>
        <div> <h2>Advanced</h2></div>
        <label> Pre-retirement rate of return
          <input type="number" /></label>
        <label> Post-retirement rate of return
          <input type="number" /></label>
        <label> Inflation
          <input type="number" /></label>
      </form>
    </div>
  );
}

export default App;
