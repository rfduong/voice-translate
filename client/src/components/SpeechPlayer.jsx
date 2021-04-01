import React from 'react';

class SpeechPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      play: false,
    }
    this.audio = new Audio('/output.mp3?nocache='+new Date().getTime());
    this.togglePlay = this.togglePlay.bind(this);
  }

  componentDidMount() {
    this.audio.addEventListener('ended', () => {
      this.setState({ play: false}, () => {
        this.audio.src = '/output.mp3?nocache='+new Date().getTime();
      });
    });
  }

  componentWillUnmount() {
    this.audio.addEventListener('ended', () => {
      this.setState({ play: false}, () => {
        this.audio.src = '/output.mp3?nocache='+new Date().getTime();
      });
    });
  }

  togglePlay() {
    console.log('audio should reload');
    const { play } = this.state;
    this.setState( {
      play: !play,
    }, () => {
      if (!play) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    });
  }

  render() {
    const { play } = this.state;
    const { createSpeech, io } = this.props;
    return (
      <button className={`btn ${io === 'output' ? 'translate-active' : ''}`} onClick={() => {this.togglePlay(); createSpeech(io)}}><i className={`bi ${play ? 'bi-megaphone-fill btn-disabled' : 'bi-megaphone'}`} alt="Listen" /></button>
    );
  }
}

export default SpeechPlayer;