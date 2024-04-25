import React from "react";
import PropTypes from 'prop-types'; // ES6

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
  constructor() {
    super();
    this.state = {
      txt: 'this is the state txt'
    }
  }

  update(e) {
    this.setState({ txt: e.target.value })
  }
  render() {
    let txt = this.props.txt;
    return (<><h1> {this.props.txt} </h1>
      <input type="text" onChange={this.update.bind(this)}>
      </input>
      <h2> {txt}</h2>
      <h2> {this.state.txt}</h2>
    </>)
  }
}

App4.propTypes = {
  WebTransportDatagramDuplexStream: PropTypes.string,
  cat: PropTypes.bigint.isRequired,
}

export default App4