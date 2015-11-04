// Assign whatever is in the react package to the variable React. 
// React is written with CAPITAL R. It's a good practice. We will use React to create multiple components
var React = require('react');

// Assing content of react-dom package to ReactDom variable
// This allows react to render to HTML since react can be used to render to apps and other stuff
var ReactDom = require('react-dom');

/*
  Create APP Component
*/

var App = React.createClass ({
	render: function(){
		return(
			<div className="catch-of-the-day">
				<div className="menu">
          <Header />
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
    return (
      <p>Header</p>
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
 

// This renders our StorePicker component inside the selected element in the dom, in this case #main. 
// The element where the component will be put in can be selected using getElementById too. It's the same thing.
ReactDom.render(<App/>, document.querySelector('#main'));




