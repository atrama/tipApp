//webpack main.js bundle.js --module-bind 'js=babel-loader' --watch
var React = require('react');
var ReactDOM = require('react-dom');
import {TipCat} from './tipCardCat.jsx';
import {TipVote} from './tipCardVote.jsx';
import {TipNew} from './tipNew.jsx';


class TipCard extends React.Component{
  render(){
    return(
      <article>
        <div>
          <TipCat category={this.props.data.category}/>
        </div>
        <p>
          {this.props.data.tipText}
        </p>
        <div>
          <time>{this.props.data.date}</time>
          <p>{this.props.data.author}</p>
        </div>
        <TipVote score={this.props.data.score}/>
      </article>
    )
  }
};

class TipList extends React.Component{
  constructor(props){
    super(props);
    this.state = {tips: []};
    this.submitTip =this.submitTip.bind(this);
  }
  componentDidMount(){
    fetch('/api/tips').then(response => {
      if(response.ok){
        return response.json();
      }else{
        console.error('something went wrong');
      }
    }).then(tipsList => {
      this.setState({tips:tipsList.tips})
    }).catch(err => {
      console.error('error', err);
    });
//    this.setState({tips: [1,2,3]});
  }
  render(){
    this.state.tips.reverse();
    let tipCards = this.state.tips.map(function(tip, index){
      return <TipCard  key={index} data={tip}/>
    });
    return (
      <div>
        <h1>Hello Tips</h1>
        <TipNew addTip={this.submitTip}/>
        {tipCards}
      </div>
    );
  }
  submitTip(tip){
    fetch('/api/tips', {
      method:"POST",
      // body: '{"foo":"bar"}'
      body: JSON.stringify(tip),
      headers:{
        'Accept':'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => {
      let errorText;
      if(response.ok){
        return response.json()
      }else{
        errorText = response.statusText || response;
        console.error(`Error: ${errorText}`);
        return Promise.reject(errorText);
      }
    }).then(res =>{
      this.setState({tips:res})
    }).catch(err => {
      console.error(err);
    })
  }
};

const body = document.body;

ReactDOM.render(
  <TipList />,
  document.getElementById('main')
);
