import React, { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
const axios = require('axios');
import Languages from './components/Languages.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: '',
      revUserInput: '',
      transformedText: '',
      languageCode: 'en',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.delayedTranslate = _.debounce(this.translateText, 500);
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    }, () => {
      this.delayedTranslate();
    });
  }

  handleLanguageChange(e) {
    this.setState({
      languageCode: e.target.value,
    });
  }

  translateText() {
    const { userInput, languageCode } = this.state;
    console.log(languageCode);
    axios.post('/translate', {
      userInput,
      languageCode
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
          {/* <Languages io="input" /> */}
          <textarea id="userInput" onChange={this.handleChange}></textarea>
        </form>
        <form>
          <Languages io="output" translateTo={this.handleLanguageChange} />
          <textarea value={userInput === '' ? 'Translation' : translatedText} disabled></textarea>
        </form>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));