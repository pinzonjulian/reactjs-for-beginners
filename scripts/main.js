// Assign whatever is in the react package to the variable React. 
// React is written with CAPITAL R. It's a good practice. We will use React to create multiple components
var React = require('react');
// Assing content of react-dom package to ReactDom variable
// This allows react to render to HTML since react can be used to render to apps and other stuff
// var ReactDom = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;

/*
  Create APP Component
*/

var App = React.createClass ({
	render: function(){
		return(
			<div className="catch-of-the-day">
				<div className="menu">
        {/*tagline is arbitrarily created by me. It could be anything. Those are the properties of a component, in this case, the header component.*/}
          <Header tagline="Fresh Seafood Market"/>
        </div>
        <Order />
        <Inventory />
			</div>
		)
	}
})

/*
  Create HEADER Component
*/

var Header = React.createClass({
  render: function(){
    console.log(this.params);
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
  render: function(){
    return (
      <p>Order</p>
    )
  }
})

/*
  Create INVENTORY Component
*/

var Inventory = React.createClass({
  render: function(){
    return (
      <p>Inventory</p>
    )
  }
})



var StorePicker = React.createClass({
	// The only thing EVERY component needs its a render method
	render: function(){
		var name = 'Julian'; 

		// Return is followed by parenthesis to allow multiline html. Easier to read and write!
		return(
			// Return ONE ELEMENT ONLY. It can have any number of nested elements but it must be a single parent.
			<form className="store-selector">
				{/*// To use a variable inside HTML code, wrap it in curly braces*/}
				<h2>Pelase enter a store {name} </h2>
				<input type="text" ref="storeId" required/>
				<input type="submit" />
			</form>
			)
	}
})
 
/*
  Routes
*/

var routes = ( 
  <Router>
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
  </Router>
)







// This renders our StorePicker component inside the selected element in the dom, in this case #main. 
// The element where the component will be put in can be selected using getElementById too. It's the same thing.
ReactDom.render(routes, document.querySelector('#main'));




