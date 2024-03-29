import React from 'react';
const axios = require('axios');

class Languages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: [],
    }
  }

  componentDidMount() {
    this.getLanguages();
  }

  getLanguages() {
    axios.get('/languages')
      .then((response) => {
        this.setState({
          languages: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const {
      io,
      translateTo,
      translateFrom,
      selectedLanguage } = this.props;
    const { languages } = this.state;
    return (
      <div className="language-options">
        <label htmlFor={io}>Language: </label>
        <select id={io} name={io} value={selectedLanguage} onChange={translateTo ? translateTo : translateFrom}>
          {languages.map((language) => {
            return <option key={language.code} value={language.code}>{language.name}</option>;
          })}
        </select>
      </div>
    );
  }
}

export default Languages;