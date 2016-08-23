define(function (require) {
    const React = require('react');

	const BreakdownItemsForm = React.createClass({
		getInitialState: function() {
			return { label: ''}
		},
		handleLabelChange: function(e) {
			this.setState({label: e.target.value});
		},
		handleSubmit: function(e) {
		    e.preventDefault();
		    this.props.callback({label: this.state.label});
		    this.setState({label: ''})
		},
	    render: function() {
	        return (
	          <form className="breakdownForm" onSubmit={this.handleSubmit}>
	          	<input
	          		type="text"
	          		placeholder="Add an activity breakdown..."
					value={this.state.label}
					onChange={this.handleLabelChange}
	          		/>
	          </form>
	        );
	    }
	});
	return BreakdownItemsForm;
});