import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: '',
      revUserInput: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.reverseText = this.reverseText.bind(this);
  }

  // placeholder transform function, should translate into another language later
  reverseText() {
    const { userInput } = this.state;
    const revUserInput = [...userInput];
    for (let i = 0; i < revUserInput.length/2; i++) {
      let temp = revUserInput[i];
      revUserInput[i] = revUserInput[revUserInput.length-i-1];
      revUserInput[revUserInput.length-i-1] = temp;
    }
    console.log(revUserInput);
    this.setState({ revUserInput });
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  render() {
    const { userInput, revUserInput } = this.state;
    return (
      <div>
        <h2>Voice Translation</h2>
        <form>
          <textarea id="userInput" onChange={this.handleChange}></textarea>
          <textarea value={userInput === '' ? 'Translation' : revUserInput} disabled></textarea>
        </form>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));