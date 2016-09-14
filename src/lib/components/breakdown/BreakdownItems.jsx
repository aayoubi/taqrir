import React, { PropTypes } from 'react';

import BreakdownItem from './BreakdownItem.jsx';

export default class BreakdownItems extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
    	const items = this.props.items.map(function(item) {
    		console.log(item)
    		return (
					<BreakdownItem key={item} label={item} />
    			);
    	});
        return (
        	<ul className="breakdownGroup-body">
          		{items}
      		</ul>
        );
    }
}