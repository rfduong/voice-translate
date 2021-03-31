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
        {commonPhrases.map((phrase) => {
          return <span key={phrase._id}>{phrase.userInput}</span>
        })}
      </div>
    );
  }
}

export default Phrases;
