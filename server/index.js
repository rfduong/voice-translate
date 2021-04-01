const express = require('express');
const db = require('../database');
const Phrase = require('../database/controllers/phrases.js');
const { Translate } = require('@google-cloud/translate').v2;
const textToSpeech = require('@google-cloud/text-to-speech');
const axios = require('axios');

const fs = require('fs');
const util = require('util');

const app = express();
require('dotenv').config();

const PORT = 3000;

const projectId = process.env.GOOGLE_PROJECT_ID;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname + '/../client/dist'));

app.use(express.static(__dirname + '/output'));

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
Text to speech
*/
const client = new textToSpeech.TextToSpeechClient();

async function getSpeech(text, languageCode) {
  const request = {
    input: { text },
    voice: { languageCode, ssmlGender: 'NEUTRAL'},
    audioConfig: { audioEncoding: 'MP3' },
  };
  const [response] = await client.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  const path = __dirname + '/output/output.mp3';
  await writeFile(path, response.audioContent, 'binary');
  console.log('Audio content written to file: output.mp3');
}

app.post('/text-to-speech', (req, res) => {
  const {
    text,
    langCode
  } = req.body;
  if (typeof text !== 'string' || text === '' || text.length > 1000 || typeof langCode !== 'string' || langCode == '') {
    console.log('error');
    console.log(text);
    res.status(500).send('Error getting speech');
    return;
  }
  getSpeech(text, langCode);
  res.send('audio file made');
});

/*
Phrases
*/
app.get('/phrases', (req, res) => {
  Phrase.getAll()
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(error);
    });
});

app.post('/phrases', (req, res) => {
  const {
    userInput,
    languageCode,
  } = req.body;
  if (typeof userInput !== 'string' || userInput === '' || userInput.length > 1000 || typeof languageCode !== 'string' || languageCode == '') {
    res.status(500).send('Error getting speech');
    return;
  }
  Phrase.findPhraseAndUpdate(userInput, languageCode)
    .then((response) => {
      res.status(201).send('');
    })
    .then((error) => {
      console.error(error);
      res.status(500).send(error);
    });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});