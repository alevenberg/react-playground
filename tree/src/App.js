import logo from './logo.svg';
import './App.css';

const files = {
  children: [
    {
      name: 'node_modules',
      children: [
        {
          name: 'ajax'
        },
        {
          name: 'stuff'
        },
      ]
    }, {
      name: "index.js"
    },
    {
      name: "package.json"
    },
  ]
};

function Entry({name, children}) {
  return <div>{name} </div>;
}

function App() {
  return (
    <div className="App">
      {files.children.map((entry)=> (<Entry {...entry}/>))}
    </div>
  );
}

export default App;
