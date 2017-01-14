var React = require('react');
var ReactDOM = require('react-dom');

class TipVote extends React.Component{
  render(){
    return(
      <div>
        <div>Score: {this.props.score}</div>
        <button>+</button>
        <button>-</button>
      </div>
    );
  }
};

export {TipVote};
