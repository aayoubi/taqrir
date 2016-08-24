define(function (require) {
    const React = require('react');
    const BreakdownItem = require('jsx!lib/components/BreakdownItem');

	const BreakdownItems = React.createClass({
	    render: function() {
	    	const items = this.props.items.map(function(item) {
	    		console.log(item)
	    		return (
    					<BreakdownItem key={item} label={item} />
	    			);
	    	});
	        return (
	        	<div className="breakdownItems">
	          		{items}
          		</div>
	        );
	    }
	});

	return BreakdownItems;
});