define(function (require) {
    const React = require('react');
    const BreakdownGroup = require('jsx!lib/components/breakdown/BreakdownGroup');
    const BreakdownGroupForm = require('jsx!lib/components/breakdown/BreakdownGroupForm');

	const Breakdown = React.createClass({
		getInitialState: function() {
			return {
				index: 0,
				groups:[]
			}
		},
		handleSubmitCallback: function() {
			// const i = this.state.index++;
			// this.state.groups.push({ index: i, key: i });
			// this.setState({groups: this.state.groups});
			console.log('group created');
		},
	    render: function() {
	    	const groups = this.props.groups.map(function(group) {
	    		return (
	    			<BreakdownGroup key={group.key} name={group.key} items={group.items}/>
    			);
	    	});
	        return (
	        	<div className="breakdown">
	        		{groups}
	        	</div>
	        );
	    }
	});

	return Breakdown;
});