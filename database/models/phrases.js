const mongoose = require('mongoose');

const phraseSchema = mongoose.Schema({
  userInput: {
    type: String,
    lowercase: true,
    maxLength: 1000,
    required: true
  },
  count: {
    type: Number,
    default: 1,
    required: true
  },
  languageCode: {
    type: String,
    required: true
  }
});

const Phrase = mongoose.model('Phrase', phraseSchema);

module.exports = Phrase;