const express = require('express');
const { Translate } = require('@google-cloud/translate').v2;
const app = express();
const PORT = 3000;
require('dotenv').config();

const projectId = process.env.GOOGLE_PROJECT_ID;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname + '/../client/dist'));

const translate = new Translate({ projectId });

async function getTranslation(text, target) {
  // const text = 'Hello, world!';
  // const target = 'ru';
  const [translation] = await translate.translate(text, target);
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);
  return translation;
}

function reverseText(text) {
  let revUserInput = [...text];
  for (let i = 0; i < revUserInput.length/2; i++) {
    let temp = revUserInput[i];
    revUserInput[i] = revUserInput[revUserInput.length-i-1];
    revUserInput[revUserInput.length-i-1] = temp;
  }
  return revUserInput.join('');
}

app.post('/translate', (req, res) => {
  console.log(req.body);
  const {
    userInput
  } = req.body;
  getTranslation(userInput, 'ru')
    .then((translation) => {
      res.send(translation);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
  // getTranslation('Hello, world!', 'ru');
});