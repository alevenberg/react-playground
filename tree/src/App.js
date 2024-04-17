import logo from './logo.svg';
import './App.css';

// https://www.youtube.com/watch?v=ixgxx_um8r8&t=1s
const files = {
  children: [
    {
      name: 'node_modules',
      children: [
        {
          name: 'ajax',
          children: [
            {
              name: 'stuff1'
            },
            {
              name: 'stuff2'
            },
          ]
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
  return <div>{name} 
  {children?.map((entry)=>(<Entry {...entry}/>))}</div>;
}

function App() {
  return (
    <div className="App">
      {files.children.map((entry)=> (<Entry {...entry}/>))}
    </div>
  );
}

export default App;
