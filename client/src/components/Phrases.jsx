import React from 'react';

const Phrases = ({ commonPhrases, changeInput }) => (
  <div id="common-phrases">
    <h3><span>Common phrases</span></h3>
      <div id="phrase-container">
        {commonPhrases.map((phrase, index) => {
        return (
          <div className="phrase" key={phrase._id}>
            <div className="phrase-number"><span>{`${index + 1}`}</span></div>
            <div className="phrase-text"><span onClick={() => changeInput(phrase.userInput)}>{phrase.userInput}</span></div>
          </div>
        );})}
    </div>
  </div>
);

export default Phrases;
