var React = require('react');
var ReactDOM = require('react-dom');

class TipNew extends React.Component{
  constructor(props){
    super(props)
    this.state = {categories : []};
  }
  componentDidMount(){
    fetch('/api/category').then(response => {
      if(response.ok){
        return response.json();
      }else{
        console.error('something went wrong');
      }
    }).then(categoryList => {
      this.setState({categories:categoryList})
    }).catch(err => {
      console.log('error');
    });
  }
  render(){
    let categoryOptions = this.state.categories.map(function(cat){
      return <option value={cat._id} key={cat._id}>{cat.name}</option>
    });
    return(
      <form name="addTip">
        <label htmlFor="tipText">Tip:</label>
        <textarea id="tipText" name="tipText"/>
        <label htmlFor="category">Category</label>
        <select id="category" name="category" defaultValue="placeholder">
          <option disabled value="placeholder">Select a Category</option>
          {categoryOptions}
        </select>
        <button onClick={this.handleSubmit.bind(this)}>Add New Tip</button>
      </form>
    );
  }
  handleSubmit(e){
    e.preventDefault();
    let form = document.forms.addTip;
    this.props.addTip({
      tipText: form.tipText.value,
      category: form.category.value
    });
    form.tipText.value = '';
    form.category.value ='placeholder'
  }
};

export {TipNew};
