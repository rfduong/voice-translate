import React from 'react';

class SpeechPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      play: false,
    }
    this.audio = new Audio(`/${this.props.io}.mp3?nocache=`+new Date().getTime());
    this.togglePlay = this.togglePlay.bind(this);
  }

  componentDidMount() {
    const { io } = this.props;
    this.audio.addEventListener('ended', () => {
      this.setState({ play: false}, () => {
        this.audio.src = `/${io}.mp3?nocache=`+new Date().getTime();
      });
    });
  }

  componentWillUnmount() {
    const { io } = this.props;
    this.audio.removeEventListener('ended', () => {
      this.setState({ play: false}, () => {
        this.audio.src = `/${io}.mp3?nocache=`+new Date().getTime();
      });
    });
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
      }
    });
  }

  render() {
    const { play } = this.state;
    const { createSpeech, io, text, languageCode } = this.props;
    return (
      <button className={`btn ${io === 'output' ? 'translate-active' : ''}`} onClick={() => {
        createSpeech(io)
          .then(() => {
            this.audio.src = `/${io}.mp3?nocache=`+new Date().getTime();
            this.togglePlay();
          })
          .catch((error) => {
            console.error(error);
          });
      }}>
        <i className={`bi ${play ? 'bi-megaphone-fill btn-disabled' : 'bi-megaphone'}`} alt="Listen" />
      </button>
    );
  }
}

export default SpeechPlayer;