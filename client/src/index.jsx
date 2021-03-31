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
      inputLanguageCode: 'en',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleOutputLanguageChange = this.handleOutputLanguageChange.bind(this);
    this.handleInputLanguageChange = this.handleInputLanguageChange.bind(this);
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

  handleOutputLanguageChange(e) {
    this.setState({
      languageCode: e.target.value,
    }, () => this.delayedTranslate());
  }

  handleInputLanguageChange(e) {
    this.setState({
      inputLanguageCode: e.target.value,
    });
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
    this.setState({
      translatedText: 'Translating...'
    }, () => {
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
          this.setState({
            translatedText: 'Error translating'
          });
        })
    });
  }

  render() {
    const {
      userInput,
      translatedText,
      languageCode,
      listening,
      inputLanguageCode,
    } = this.state;
    return (
      <div id="app">
        <h2>Voice Translation</h2>
        <div id="content">
          <Languages io="input" translateFrom={this.handleInputLanguageChange} selectedLanguage={inputLanguageCode}/>
          <Languages io="output" translateTo={this.handleOutputLanguageChange} selectedLanguage={languageCode} />
          <div id="input-well">
            <form id="input-well-content">
              <textarea id="userInput" value={userInput} onChange={this.handleChange} maxLength="1000" autoFocus></textarea>
            </form>
            <div id="input-well-footer">
              <div id="input-well-footer-buttons">
                <button className={`btn ${listening ? 'btn-disabled' : ''}`} onClick={this.handleListen} disabled={listening}>{listening ? <i className="bi bi-mic-fill" alt="Translate by voice" /> : <i className="bi bi-mic" alt="Microphone active" />}</button>
                {userInput ? <button className="btn"><i className="bi bi-megaphone" alt="Listen" /></button> : ''}
              </div>
              <span>{`${userInput.length}/1000`}</span>
            </div>
          </div>
          <div id="output-well">
            <form id="output-well-content">
              <textarea className="text-disabled" value={userInput === '' ? 'Translation' : translatedText} disabled></textarea>
            </form>
            {userInput
              ? (
                <div id="output-well-footer">
                  <button className="btn"><i className="bi bi-megaphone" alt="Listen" /></button>
                  <button className="btn"><i className="bi bi-clipboard" /></button>
                </div>
              ) : ''}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));