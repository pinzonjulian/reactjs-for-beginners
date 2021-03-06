// Assign whatever is in the react package to the variable React. 
// React is written with CAPITAL R. It's a good practice. We will use React to create multiple components
var React = require('react');
// Assing content of react-dom package to ReactDom variable
// This allows react to render to HTML since react can be used to render to apps and other stuff
var ReactDom = require('react-dom');

var CSSTransitionGroup = require('react-addons-css-transition-group');


// Assign variables to react-router
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;
// This uses the createBrowserHistory to eliminate use HTML5 hash feature to change url without re
// HTML 5 push state: feature that allows url change without refreshing the page. 
// npm install history
// This will load in the required code to be able to do push state
var createBrowserHistory = require('history/lib/createBrowserHistory');


// Firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://jpecatchapp.firebaseio.com/');

// React Catalyst

var Catalyst = require('react-catalyst');


var h = require('./helpers')

/*
  Create APP Component
*/

var App = React.createClass ({
  mixins : [Catalyst.LinkedStateMixin],
  // initial state (it's blank)
  getInitialState : function (){
    return {
      fishes: {},
      order : {}
    }
  },
  componentDidMount : function (){
    base.syncState(this.props.params.storeId + '/fishes', {
      context: this,
      state: 'fishes'
    });
    var localStorageRef = localStorage.getItem('order-' +  this.props.params.storeId)

    if(localStorageRef){
      this.setState({
        order: JSON.parse(localStorageRef)
      })
    }
  },
  componentWillUpdate : function(nextProps, nextState){
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
  },
  addToOrder : function (key){
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({ order: this.state.order })
  },
  removeFromOrder : function(key){
    delete this.state.order[key];
    this.setState({
      order : this.state.order
    });
  },
  addFish : function (fish){
    var timestamp = (new Date()).getTime();
    // update state object
    this.state.fishes['fish-' + timestamp] = fish;
    // set the state
    this.setState({fishes : this.state.fishes});
  },
  removeFish : function (key){
    if(confirm("Are you sure you want to remove this fish?")){
      this.state.fishes[key] = null;
      this.setState({
        fishes: this.state.fishes
      });
    }
  },
  loadSamples : function(){
    this.setState({
      fishes: require ('./sample-fishes')
    });
  },
  renderFish : function(key){
    return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
  },
	render: function(){
		return(
			<div className="catch-of-the-day">
				<div className="menu">
        {/*tagline is arbitrarily created by me. It could be anything. Those are the properties of a component, in this case, the header component.*/}
          <Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder} />
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples} fishes={this.state.fishes} linkState = {this.linkState} removeFish= {this.removeFish}  />
			</div>
		)
	}
})


/*
  Fish component
  <Fish />
*/

var Fish = React.createClass({
  onButtonClick : function (){
    var key = this.props.index;
    this.props.addToOrder(key);
  },
  render: function (){
    var details = this.props.details;
    var isAvailable = (details.status === 'available' ? true : false);
    var buttonText = (isAvailable ? 'Add To Order' : 'Sold Out');
    return(
      <li className="menu-fish">
        <img src={details.image} alt={details.name}/>
        <h3 className="fish-name">
          {details.name}
          <span className="price">{h.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
      </li>
    )
  }
})



/*
  Add Fish Form
  <AddFishForm />
*/


var AddFishForm = React.createClass({
  createFish : function (event){
    // 1. Stop form from submitting
    event.preventDefault();
    // 2. Take data from form and create object
    var fish = {
      name : this.refs.name.value,
      price : this.refs.price.value,
      status : this.refs.status.value,
      desc : this.refs.desc.value,
      image : this.refs.image.value
    }

    // 3. Add the fish to the App State
    this.props.addFish(fish);
    this.refs.fishForm.reset();
  },
  render: function(){
    return (
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price"/>
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to image" />
        <button type="submit">+ Add Item</button>
      </form>
    )
  }
})



/*
  Create HEADER Component
*/

var Header = React.createClass({
  render: function(){
    return (
      <header className="top">
        <h1>
          Catch 
          <span className="ofThe">
            <span className="of">of</span>
            <span className="the">the</span> 
          </span>
          Day
        </h1>
        <h3 className="tagline"><span>{this.props.tagline}</span></h3>
      </header>
    )
  }
})

/*
  Create ORDER Component
*/

var Order = React.createClass({
  renderOrder : function (key){
    var fish = this.props.fishes[key];
    var count = this.props.order[key];
    var removeButton = <button onClick={this.props.removeFromOrder.bind(null,key)} > &times; </button>;

    if(!fish){
      return <li key={key}>Sorry, fish no longer available! {removeButton} </li>
    }

    return(
      <li key={key}>

        <CSSTransitionGroup component="span" transitionName="count" transitionEntertimeout={250} transitionLeaveTimeout={250}>
          <span key={count}>{count}</span>
        </CSSTransitionGroup>
        
        
        lbs{fish.name} { removeButton }
        <span className="price">{h.formatPrice(count * fish.price)}</span>
      </li>
    )
  },
  render: function(){
    var orderIds = Object.keys(this.props.order);
    var total = orderIds.reduce((prevTotal, key)=>{
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      var isAvailable = fish && fish.status === 'available';
      if(fish && isAvailable){
        return prevTotal + (count * parseInt(fish.price) || 0);
      }

      return prevTotal;
    }, 0);
    return (
      <div className="order-wrap">
      <h2 className="order-title">Order</h2>
      <CSSTransitionGroup 
          className="order" 
          component="ul" 
          transitionName="order"
          transitionEntertimeout={500}
          transitionLeaveTimeout={500}
        >
        {orderIds.map(this.renderOrder)}
        <li className="total">
          <strong>Total:</strong>
          {h.formatPrice(total)}
        </li>
      </CSSTransitionGroup>
      </div>
      
    )
  }
})

/*
  Create INVENTORY Component
*/

var Inventory = React.createClass({
  renderInventory : function (key){
    var linkState = this.props.linkState;
    return (
      <div className="fish-edit" key={key}>
        <input type="text" valueLink={linkState('fishes.' + key + '.name')} />
        <input type="text" valueLink={linkState('fishes.' + key + '.price')} />
        <select valueLink={linkState('fishes.' + key + '.status')}>
          <option value="unavailable">Sold Out!</option>
          <option value="available">Fresh</option>
        </select>
        <textarea valueLink={linkState('fishes.' + key + '.desc')} ></textarea>
        <input type="text" valueLink={linkState('fishes.' + key + '.image')} />
        <button onClick={this.props.removeFish.bind(null, key)} >Remove Fish</button>
      </div>
    )
  },
  render: function(){
    return (
      <div>
        <h2>Inventory</h2>
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
})

/*
  Create StorePicker Component
*/


var StorePicker = React.createClass({
  mixins : [History],
  goToStore : function(event){
    event.preventDefault();
    // Get data from input
    // "this" is the component StorePicker
    // refs refers to the ref in the input field in store-selector. Refs references to that input value
    var storeId = this.refs.storeId.value;
    console.log(storeId);
    // Transition from StorePicker to App component
    this.history.pushState(null, '/store/' + storeId);
  },
	// The only thing EVERY component needs its a render method
	render: function(){
		var name = 'Julian'; 

		// Return is followed by parenthesis to allow multiline html. Easier to read and write!
		return(
			// Return ONE ELEMENT ONLY. It can have any number of nested elements but it must be a single parent.
			<form className="store-selector" onSubmit={this.goToStore}>
				{/*// To use a variable inside HTML code, wrap it in curly braces*/}
				<h2>Pelase enter a store {name} </h2>
				<input type="text" ref="storeId" defaultValue={h.getFunName()} required/>
				<input type="submit" />
			</form>
			)
	}
})

/*
  Not found
*/
 
var NotFound = React.createClass({
  render: function(){
    return <h1>Not Found!</h1>
  }
})

/*
  Routes
*/

// ReactRouter works with createBrowserHistory
var routes = ( 
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
)







// This renders our StorePicker component inside the selected element in the dom, in this case #main. 
// The element where the component will be put in can be selected using getElementById too. It's the same thing.
ReactDom.render(routes, document.querySelector('#main'));




