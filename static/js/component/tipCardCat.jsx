var React = require('react');
var ReactDOM = require('react-dom');

class TipCat extends React.Component{
  render(){
    return(
      <h1>{this.props.category}</h1>
    );
  }
};

export {TipCat};
