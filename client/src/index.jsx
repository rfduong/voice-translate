import React, { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
const axios = require('axios');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: '',
      revUserInput: '',
      transformedText: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.delayedTranslate = _.debounce(this.translateText, 500);
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    }, () => {
      this.delayedTranslate();
    });
  }

  translateText() {
    const { userInput } = this.state;
    axios.post('/translate', {
      userInput
    })
      .then((response) => {
        console.log(response);
        this.setState({
          translatedText: response.data,
        });
      })
      .catch((error) => {
        console.error(error);
      })
  }

  render() {
    const { userInput, revUserInput, translatedText } = this.state;
    return (
      <div>
        <h2>Voice Translation</h2>
        <form>
          <textarea id="userInput" onChange={this.handleChange}></textarea>
          <textarea value={userInput === '' ? 'Translation' : translatedText} disabled></textarea>
        </form>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));