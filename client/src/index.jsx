import React, { createRef } from 'react';
import ReactDOM from 'react-dom';
import Languages from './components/Languages.jsx';
import Phrases from './components/Phrases.jsx';
import SpeechPlayer from './components/SpeechPlayer.jsx';
import _ from 'lodash';
import 'normalize.css';
const axios = require('axios');

let SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: '',
      translatedText: '',
      languageCode: 'en',
      listening: false,
      inputLanguageCode: 'en',
      commonPhrases: [],
      copySuccess: false,
      voicePlaying: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOutputLanguageChange = this.handleOutputLanguageChange.bind(this);
    this.handleInputLanguageChange = this.handleInputLanguageChange.bind(this);
    this.handleListen = this.handleListen.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.copyToClipBoard = this.copyToClipBoard.bind(this);
    this.getPhrases = this.getPhrases.bind(this);
    this.initializeSpeechRecognition = this.initializeSpeechRecognition.bind(this);
    this.createSpeech = this.createSpeech.bind(this);
    this.delayedTranslate = _.debounce(this.translateText, 300);
    this.recognition = new SpeechRecognition();
    this.translateArea = React.createRef();
  }

  componentDidMount() {
    this.initializeSpeechRecognition();
    this.getPhrases();
  }

  handleInputChange(e) {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
    this.translateArea.current.style.height = 'inherit';
    this.translateArea.current.style.height = `${e.target.scrollHeight}px`;
    this.setState({
      userInput: e.target.value,
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

  getPhrases() {
    axios.get('/phrases')
      .then((response) => {
        this.setState({ commonPhrases: response.data });
      })
      .catch((error) => {
        console.error(error);
      })
  }

  changeInput(text) {
    this.setState({
      userInput: text,
    }, () => this.delayedTranslate());
  }

  copyToClipBoard(textarea) {
    navigator.clipboard.writeText(textarea.current.value);
    this.translateArea.current.select();
    this.setState({
      copySuccess: true,
    });
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

  createSpeech(io) {
    const { userInput, translatedText, inputLanguageCode, languageCode } = this.state;
    if (userInput === '') {
      return;
    }
    let text = userInput;
    let langCode = inputLanguageCode;
    if (io === 'output') {
      text = translatedText;
      langCode = languageCode;
    }
    console.log(text, langCode);
    return axios.post('/text-to-speech', {
      text,
      langCode,
      io,
    });
  }

  translateText() {
    const { userInput, languageCode } = this.state;
    if (userInput === '') {
      return;
    }
    this.setState({
      translatedText: 'Translating...',
      copySuccess: false,
    }, () => {
      axios.post('/translate', {
        userInput,
        languageCode
      })
        .then((response) => {
          this.setState({
            translatedText: response.data,
          }, () => {
            axios.post('/phrases', {
              userInput,
              languageCode: "en",
            })
              .then(() => {})
              .catch((postErr) => {
                console.error(postErr);
              })
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
      commonPhrases,
      copySuccess,
      voicePlaying,
    } = this.state;
    return (
      <div id="app">
        <h2><span>Voice </span>Translation</h2>
        <div id="content">
          <Languages io="input" translateFrom={this.handleInputLanguageChange} selectedLanguage={inputLanguageCode}/>
          <Languages io="output" translateTo={this.handleOutputLanguageChange} selectedLanguage={languageCode} />
          <div id="input-well">
            <form id="input-well-content">
              <textarea id="userInput" value={userInput} onChange={this.handleInputChange} placeholder={listening ? 'Speak now' : ''} maxLength="1000" autoFocus></textarea>
            </form>
            <div id="input-well-footer">
              <div id="input-well-footer-buttons">
                <button className={`btn ${listening ? 'btn-disabled' : ''}`} onClick={this.handleListen} disabled={listening}>{listening ? <i className="bi bi-mic-fill" alt="Translate by voice" /> : <i className="bi bi-mic" alt="Microphone active" />}</button>
                {userInput ? <SpeechPlayer createSpeech={this.createSpeech} io={'input'}/> : ''}
              </div>
              <span>{`${userInput.length}/1000`}</span>
            </div>
          </div>
          <div id="output-well" className={`${userInput === '' ? '' : 'translate-active'}`}>
            <form id="output-well-content">
              <textarea ref={this.translateArea} className={`text-disabled ${userInput === '' ? '' : 'translate-active'}`} placeholder="Translation" value={userInput === '' ? '' : translatedText} disabled></textarea>
            </form>
            {userInput
              ? (
                <div id="output-well-footer">
                  <SpeechPlayer createSpeech={this.createSpeech} io={'output'}/>
                  <button className="btn translate-active" onClick={() => this.copyToClipBoard(this.translateArea)}><i className={`bi ${copySuccess ? 'bi-clipboard-check btn-disabled' : 'bi-clipboard'}`} /></button>
                </div>
              ) : ''}
          </div>
        </div>
        {commonPhrases.length > 0 ? <Phrases commonPhrases={commonPhrases} changeInput={this.changeInput} /> : ''}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));