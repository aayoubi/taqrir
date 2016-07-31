define(function (require) {
    const React = require('react');

	const Label = React.createClass({
	    render: function() {
	      return (
	        <div className="desc">
	          <h3>{this.props.title}</h3>
	          <p>spent {this.props.manDays.toFixed(2)} days working.</p>
	        </div>
	      );
	    }
	});

	return Label;

});