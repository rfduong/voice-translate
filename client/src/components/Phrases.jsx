import React from 'react';

class Phrases extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { commonPhrases } = this.props;
    return (
      <div id="common-phrases">
        <h3>Common phrases</h3>
        <div id="phrase-container">
          {commonPhrases.map((phrase, index) => {
            return (
              <div className="phrase" key={phrase._id}>
                <div className="phrase-number"><span>{`${index + 1}`}</span></div>
                <div className="phrase-text"><span>{phrase.userInput}</span></div>
              </div>
            );})}
        </div>
      </div>
    );
  }
}

export default Phrases;
