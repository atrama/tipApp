var React = require('react');
var ReactDOM = require('react-dom');

class TipVote extends React.Component{
  render(){
    return(
      <div>
        <div>Score: {this.props.score}</div>
        <button type="button" onClick={this.addPoint.bind(this)} disabled={this.props.disabled}>+</button>
        <button type="button" onClick={this.subtractPoint.bind(this)} disabled={this.props.disabled}>-</button>
      </div>
    );
  }
  addPoint(e){
    e.preventDefault();
    this.submitChange();
  }
  subtractPoint(e){
    e.preventDefault();
    this.submitChange((-1));
  }
  submitChange(value = 1){
    this.props.submitChange(value);
  }
};

export {TipVote};
