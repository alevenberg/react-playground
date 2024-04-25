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
      <input type="text" onChange={this.update.bind(this)} />
      <Widget update={this.update.bind(this)} />
      <Widget update={this.update.bind(this)} />
      <Widget update={this.update.bind(this)} />
      <h2> {txt}</h2>
      <h2> {this.state.txt}</h2>
    </>)
  }
}

const Widget = (props) => <input type="text" onChange={props.update} />

// App4.propTypes = {
// txt: PropTypes.string,
// cat: PropTypes.bigint,
// }

class App5 extends React.Component {
  render() {
    return (<>
      <Button>I <Heart></Heart>React </Button>
    </>)
  }
}

class Heart extends React.Component {
  render() {
    return (<>
      <span> &hearts; </span>
    </>)
  }
}
const Button = (props) => <button> {props.children} </button>

class App6 extends React.Component {
  constructor() {
    super();
    this.state = { currentEvent: '----' };
    this.update = this.update.bind(this);
  }

  update(e) {
    this.setState({ currentEvent: e.type })
  }

  render() {
    return (<>
      <textarea cols="30" rows="10"
        onFocus={this.update}
        onBlur={this.update}
        onMouseDown={this.update}
        onDoubleClick={this.update}
        onTouchStart={this.update}
        onTouchMove={this.update}
        onTouchEnd={this.update}
        onKeyUp={this.update}
        onPaste={this.update}
        onCopy={this.update}
        onCut={this.update}>

      </textarea>
      <h1>{this.state.currentEvent}</h1> </>)
  }
}

class App7 extends React.Component {
  constructor() {
    super();
    this.state = { a: '' }
    this.state = { b: '' }
  }
  update(e) {
    this.setState({
      a: this.refs.a.value,
      b: this.refs.b.value,
    })
  }
  render() {
    return (<div>
      <input ref="a" type="text"
        onChange={this.update.bind(this)} />
      {this.state.a}
      <hr />
      <input ref="b" type="text"
        onChange={this.update.bind(this)} />
      {this.state.b}
    </div >)
  }
}
export default App7