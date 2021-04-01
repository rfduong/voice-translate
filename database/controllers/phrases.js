const Phrase = require('../models/phrases.js');

const findPhraseAndUpdate = (userInput, languageCode) => {
  return Phrase.findOneAndUpdate({userInput, languageCode}, {$inc: {count: 1}}, {new: true, upsert: true});
}

const getAll = () => {
  return Phrase.find({}).sort({count: -1}).limit(10);
}

const getRecent = () => {
  return Phrase.find({}).sort({_id : -1}).limit(10);
}

module.exports = {
  findPhraseAndUpdate,
  getAll,
  getRecent
};