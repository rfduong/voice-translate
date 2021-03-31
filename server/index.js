const express = require('express');
const db = require('../database');
const Phrase = require('../database/controllers/phrases.js');
const { Translate } = require('@google-cloud/translate').v2;
// const recorder = require('node-record-lpcm16');
// const speech = require('@google-cloud/speech');

const app = express();
require('dotenv').config();

const PORT = 3000;

const projectId = process.env.GOOGLE_PROJECT_ID;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname + '/../client/dist'));

/*
Translation
*/
const translate = new Translate({ projectId });

async function getTranslation(text, target) {
  const [translation] = await translate.translate(text, target);
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);
  return translation;
}

app.post('/translate', (req, res) => {
  console.log(req.body);
  const {
    userInput,
    languageCode
  } = req.body;
  if (typeof userInput !== 'string' || userInput.length > 1000) {
    res.status(500).send('Invalid request');
    return;
  }
  getTranslation(userInput, languageCode)
    .then((translation) => {
      res.send(translation);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});

async function listLanguages() {
  const [languages] = await translate.getLanguages();
  return languages;
}

app.get('/languages', (req, res) => {
  listLanguages()
    .then((languages) => {
      res.send(languages);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});

/*
Speech to text - google speech api - doesn't work
- Tried quickstart example in here, would not work
  - quickstart example: https://cloud.google.com/speech-to-text/docs/samples/speech-transcribe-streaming-mic#speech_transcribe_streaming_mic-nodejs
- doesn't work on their terminal either
- depends on sox
  - sox is a library last updated 6 years ago that depends on deprecated ubuntu features
- also, i'm using windows, which means i'm on WSL
- WSL has no way of natively connecting my microphone so I can't test it
- will have to use web speech api in browser rather than google speech api on node
*/

app.get('/phrases', (req, res) => {
  Phrase.getAll()
    .then((response) => {
      console.log(response);
      res.send(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(error);
    });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});