import React, { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
const axios = require('axios');
import Languages from './components/Languages.jsx';

let SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: '',
      transformedText: '',
      languageCode: 'en',
      listening: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleListen = this.handleListen.bind(this);
    this.initializeSpeechRecognition = this.initializeSpeechRecognition.bind(this);
    this.delayedTranslate = _.debounce(this.translateText, 300);
    this.recognition = new SpeechRecognition();
  }

  componentDidMount() {
    this.initializeSpeechRecognition();
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
    }, () => this.delayedTranslate());
  }

  handleListen() {
    this.recognition.start();
  }

  initializeSpeechRecognition() {
    const context = this;
    // This runs when the speech recognition service starts
    this.recognition.onstart = function() {
      context.setState({
        listening: true,
      });
    };

    this.recognition.onspeechend = function() {
        // when user is done speaking
        context.recognition.stop();
        context.setState({
          listening: false,
        });
    }
    // This runs when the speech recognition service returns result
    this.recognition.onresult = function(event) {
      let transcript = event.results[0][0].transcript;
      let confidence = event.results[0][0].confidence;
      context.setState({
        userInput: transcript,
      }, () => {
        context.delayedTranslate();
      });
    };
  }

  translateText() {
    const { userInput, languageCode } = this.state;
    if (userInput === '') {
      return;
    }
    axios.post('/translate', {
      userInput,
      languageCode
    })
      .then((response) => {
        this.setState({
          translatedText: response.data,
        });
      })
      .catch((error) => {
        console.error(error);
      })
  }

  render() {
    const {
      userInput,
      translatedText,
      languageCode,
      listening,
    } = this.state;
    return (
      <div>
        <h2>Voice Translation</h2>
        <form>
          {/* <Languages io="input" /> */}
          <textarea id="userInput" value={userInput} onChange={this.handleChange} maxLength="1000"></textarea>
          {`${userInput.length}/1000`}
        </form>
        <form>
          <Languages io="output" translateTo={this.handleLanguageChange} selectedLanguage={languageCode} />
          <textarea value={userInput === '' ? 'Translation' : translatedText} disabled></textarea>
        </form>
        <button onClick={this.handleListen} disabled={listening}>{listening ? 'Listening...' : 'Microphone Icon here'}</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));