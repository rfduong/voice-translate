import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <h2>Voice Translation</h2>
        <form>
          <textarea value=""></textarea>
        </form>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));