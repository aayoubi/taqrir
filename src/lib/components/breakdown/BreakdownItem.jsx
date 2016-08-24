define(function (require) {
    const React = require('react');

	const BreakdownItem = React.createClass({
	    render: function() {
	        return (
	          <div className="breakdownItem">
	          	<span>{this.props.label}</span>
	          </div>
	        );
	    }
	});

	return BreakdownItem;
});