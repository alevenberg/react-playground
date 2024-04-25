import React from "react";

// Stateless
const App = () => <h1> Hello </h1>

// Stateful
class App2 extends React.Component {
  render() {
    return <h1> Hello2 </h1>
  }
}

// Multiple divs
class App3 extends React.Component {
  render() {
    return (<><h1> Hello3 </h1> <h2> Hey</h2></>)
  }
}

class App4 extends React.Component {
  render() {
    let txt = this.props.txt;
    return (<><h1> {this.props.txt} </h1> <h2> {txt}</h2></>)
  }
}

export default App4