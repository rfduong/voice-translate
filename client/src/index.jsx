import React, { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import Languages from './components/Languages.jsx';
import _ from 'lodash';
import 'normalize.css';
const axios = require('axios');

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
      <div id="app">
        <h2>Voice Translation</h2>
        <div id="content">
          <Languages io="input" />
          <Languages io="output" translateTo={this.handleLanguageChange} selectedLanguage={languageCode} />
          <div id="input-well">
            <form id="input-well-content">
              <textarea id="userInput" value={userInput} onChange={this.handleChange} maxLength="1000" autoFocus></textarea>
            </form>
            <div id="input-well-footer">
              <button className={`btn ${listening ? 'btn-disabled' : ''}`} onClick={this.handleListen} disabled={listening}>{listening ? <i className="bi bi-mic-fill" /> : <i className="bi bi-mic" />}</button>
              <span>{`${userInput.length}/1000`}</span>
            </div>
          </div>
          <div id="output-well">
            <form id="output-well-content">
              <textarea className="text-disabled" value={userInput === '' ? 'Translation' : translatedText} disabled></textarea>
            </form>
            {translatedText
              ? (
                <div id="output-well-footer">
                  <button className="btn"><i className="bi bi-megaphone" /></button>
                </div>
              ) : ''}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));