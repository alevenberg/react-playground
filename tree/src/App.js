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

function Entry({entry, depth}) {
  return <div>{entry.name} 
  <div style={{paddingLeft: `${depth*10}px`}}>
  {entry.children?.map((entry)=>(<Entry entry={entry} depth={depth+1}/>))}</div>
  </div>;
}

function App() {
  return (
    <div className="App">
      {files.children.map((entry)=> (<Entry entry={entry} depth={1}/>))}
    </div>
  );
}

export default App;
