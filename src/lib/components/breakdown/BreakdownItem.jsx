import React, { PropTypes } from 'react';

export default class BreakdownItem extends React.Component {
    constructor(props) {
        super(props);
        this.clickEvent = this.clickEvent.bind(this);
        this.state = {
        	id: props.id,
        	label: props.label,
        	group: props.group
        }
        console.log("created item [" + this.state.label + "] in group [" + this.state.group + "]");
    }
    
    clickEvent() {
    	console.log("clicked on " + this.state.label);
    	// FIXME should we pass in the whole state here ??
    	this.props.moveItemRandomly(this.state);
    }

    render() {
        return (
            <li onClick={this.clickEvent}><span className="label label-primary">{this.state.label}</span></li>
        );
    }
}