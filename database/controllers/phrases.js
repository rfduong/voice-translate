const Phrase = require('../models/phrases.js');

const findPhraseAndUpdate = () => {
  return null;
}

const getAll = () => {
  return Phrase.find({}).sort({count: -1});
}

module.exports = {
  findPhraseAndUpdate,
  getAll
};