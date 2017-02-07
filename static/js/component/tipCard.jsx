//webpack main.js bundle.js --module-bind 'js=babel-loader' --watch
var React = require('react');
var ReactDOM = require('react-dom');
import {TipCat} from './tipCardCat.jsx';
import {TipVote} from './tipCardVote.jsx';
import {TipNew} from './tipNew.jsx';


class TipCard extends React.Component{
  constructor(props){
    super(props);
    this.sendSubmit =this.sendSubmit.bind(this);
  }
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
        <TipVote score={this.props.data.score} disabled={this.props.data.disabled} id={this.props.data.id} submitChange={this.sendSubmit}/>
      </article>
    )
  }
  sendSubmit(value){
    this.props.sendSubmit(this.props.data._id, value);
  }
};

class TipList extends React.Component{
  constructor(props){
    super(props);
    this.state = {tips: []};
    this.submitTip =this.submitTip.bind(this);
    this.changeScore =this.changeScore.bind(this);
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
  }
  render(){
    let tipCards = this.state.tips.map((tip, index) => {
      return <TipCard  key={index} data={tip} sendSubmit={this.changeScore} />
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
  changeScore(id, value){
    //filter by tip id, then change state on that tip
    var id = id;
    var theIndex;

    fetch(`/api/tips/${id}`, {
      method:"PATCH",
      body: `{"value":${value}}`,
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
      let updatedTips = this.state.tips;
      let iterator = 0;
      //TODO: set disabled in DB!
      res['disabled'] = true;
//      alert('dont map, filterBy Id then update it');
      for (let tip of updatedTips){
        if(tip._id == res._id){
          updatedTips[iterator] = res
          break;
        }
        iterator ++;
      }
      this.setState({tips:updatedTips})
    }).catch(err => {
      console.error(err);
    })

    function matchId(item, index){
      if(item._id === id){
        theIndex = index;
        return true;
      };
    }
    try{
      let tip = this.state.tips.filter(matchId)[0];
      let state = Object.assign({}, this.state);
      state.tips[theIndex] = tip;
      this.setState(state);
    }catch(e){
      console.error(e);
    }
  }
};

const body = document.body;

ReactDOM.render(
  <TipList />,
  document.getElementById('main')
);
