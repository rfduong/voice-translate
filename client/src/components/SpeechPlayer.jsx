import React from 'react';

class SpeechPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      play: false,
    }
    this.audio = new Audio('/output.mp3');
    this.togglePlay = this.togglePlay.bind(this);
  }

  componentDidMount() {
    this.audio.addEventListener('ended', () => this.setState({ play: false }));
  }

  componentWillUnmount() {
    this.audio.removeEventListener('ended', () => this.setState({ play: false }));
  }

  togglePlay() {
    const { play } = this.state;
    this.setState( {
      play: !play,
    }, () => {
      if (!play) {
        this.audio.play();
      } else {
        this.audio.pause();
        this.audio.load();
      }
    });
  }

  render() {
    const { play } = this.state;
    const { createSpeech, io } = this.props;
    return (
      <div>
        <button className={`btn ${io === 'output' ? 'translate-active' : ''}`} onClick={() => {this.togglePlay(); createSpeech(io)}}><i className={`bi ${play ? 'bi-megaphone-fill btn-disabled' : 'bi-megaphone'}`} alt="Listen" /></button>
      </div>
    );
  }
}

export default SpeechPlayer;