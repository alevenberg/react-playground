import './App.css';
import { useState, useEffect } from 'react';

function App() {
  // Local storage stores key value string pairs
  // Set the || as the default
  const initialRetirementAge = Number(localStorage.getItem("retirementAge") || 67);
  const initialTargetRetAmt = Number(localStorage.getItem("targetRetAmt") || 0);
  const initialAnnualRetExp = Number(localStorage.getItem("annualRetExp") || 30000);
  const initialCurrentAge = Number(localStorage.getItem("currentAge") || 22);
  const initialCurrentSavings = Number(localStorage.getItem("currentSavings") || 1000);
  const initialContributions = Number(localStorage.getItem("contributions") || 1000);
  const initialContributionFreq = localStorage.getItem("contributionFreq") || "Monthly";
  const initialPreRetROR = Number(localStorage.getItem("preRetROR") || 7);
  const initialPostRetROR = Number(localStorage.getItem("postRetROR") || 7);
  const initialInflation = Number(localStorage.getItem("inflation") || 3);

  const [retirementAge, setRetirementAge] = useState(initialRetirementAge);
  const [targetRetAmt, setTargetRetAmt] = useState(initialTargetRetAmt);
  const [annualRetExp, setAnnualRetExp] = useState(initialAnnualRetExp);
  const [currentAge, setCurrentAge] = useState(initialCurrentAge);
  const [currentSavings, setCurrentSavings] = useState(initialCurrentSavings);
  const [contributions, setContributions] = useState(initialContributions);
  const [contributionFreq, setContributionFreq] = useState(initialContributionFreq);
  const [preRetROR, setPreRetROR] = useState(initialPreRetROR);
  const [postRetROR, setPostRetROR] = useState(initialPostRetROR);
  const [inflation, setInflation] = useState(initialInflation);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2
  });

  const calculateRetirementAge = (updatedTargetRetAmt) => {
    const netPreRetROR = (preRetROR - inflation) / 100;
    let currBal = currentSavings;

    const annualCont = contributionFreq === "Annually" ? contributions : contributions * 12;
    let retAge = currentAge;

    while (currBal < updatedTargetRetAmt) {
      currBal = annualCont + currBal * (1 + netPreRetROR);
      retAge += 1;
      if (retAge > 100) break;
    }
    return retAge;
  }

  useEffect(() => {
    localStorage.setItem('retirementAge', retirementAge);
    localStorage.setItem('targetRetAmt', targetRetAmt);
    localStorage.setItem('annualRetExp', annualRetExp);
    localStorage.setItem('currentAge', currentAge);
    localStorage.setItem('currentSavings', currentSavings);
    localStorage.setItem('contributions', contributions);
    localStorage.setItem('contributionFreq', contributionFreq);
    localStorage.setItem('preRetROR', preRetROR);
    localStorage.setItem('postRetROR', postRetROR);
    localStorage.setItem('inflation', inflation);

    let netPostRetROR = (postRetROR - inflation) / 100;
    if (netPostRetROR == 0) netPostRetROR = 0.00001;

    let updatedTargetRetAmt = annualRetExp / netPostRetROR;
    setTargetRetAmt(updatedTargetRetAmt);

    const retAge = calculateRetirementAge(updatedTargetRetAmt);
    setRetirementAge(retAge);

  }, [annualRetExp, currentAge, currentSavings, contributions, contributionFreq, preRetROR, postRetROR, inflation])

  return (
    <div className="App">
      <h1>Fire Calculator</h1>
      <h2>You can retire at age {retirementAge}</h2>
      <div>Target retirement amount: {formatter.format(targetRetAmt)}</div>
      <form className='fire-calc-form'>
        <label> Age
          <input type="number" value={currentAge} onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)} />
        </label>
        <label> Current savings
          <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(parseInt(e.target.value) || 0)} />
        </label>

        <label> Annual retirement expenses
          <input type="number" value={annualRetExp} onChange={(e) => setAnnualRetExp(parseInt(e.target.value) || 0)} />
        </label>
        <label> Regular contributions
          <input type="number" value={contributions} onChange={(e) => setContributions(parseInt(e.target.value) || 0)} />
        </label>
        <label> Contritbution frequency
          <select type="number" value={contributionFreq} onChange={(e) => setContributionFreq(e.target.value)} >
            <option value="Monthly"> Monthly</option>
            <option value="Annually"> Annually</option>
          </select>
        </label>
        <div> <h2>Advanced</h2></div>
        <label> Pre-retirement rate of return
          <input type="number" value={preRetROR} onChange={(e) => setPreRetROR(parseInt(e.target.value) || 0)} />
        </label>
        <label> Post-retirement rate of return
          <input type="number" value={postRetROR} onChange={(e) => setPostRetROR(parseInt(e.target.value) || 0)} />
        </label>
        <label> Inflation
          <input type="number" value={inflation} onChange={(e) => setInflation(parseInt(e.target.value) || 0)} />
        </label>
      </form>
    </div >
  );
}

export default App;
