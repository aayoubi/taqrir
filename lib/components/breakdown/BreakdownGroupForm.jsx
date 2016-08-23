define(function (require) {
    const React = require('react');

	const BreakdownGroupForm = React.createClass({
		handleSubmit: function(e) {
		    e.preventDefault();
		    this.props.callback();
			console.log('created a new group');
		},
	    render: function() {
	        return (
	          <form className="breakdownForm" onSubmit={this.handleSubmit}>
		        <input type="submit" value="Create new group" />
	          </form>
	        );
	    }
	});

	return BreakdownGroupForm;
});