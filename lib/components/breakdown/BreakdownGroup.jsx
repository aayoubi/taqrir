define(function (require) {
    const React = require('react');
    const BreakdownItems = require('jsx!lib/components/BreakdownItems');
    const BreakdownItemsForm = require('jsx!lib/components/BreakdownItemsForm');

	const BreakdownGroup = React.createClass({
		getInitialState: function() {
			return {
				items:[]
			}
		},
		handleSubmitCallback: function(item) {
			const newItems = this.state.items;
			newItems.push(item.label)
			this.setState({items: newItems});
			console.log('item created', newItems);
		},
	    render: function() {
	        return (
	          <div className="breakdownGroup">
	          	<h3>{this.props.name}</h3>
	          	<BreakdownItems items={this.props.items}/>
	          </div>
	        );
	    }
	});

	return BreakdownGroup;
});