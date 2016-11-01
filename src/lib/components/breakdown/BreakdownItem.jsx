import React, { PropTypes } from 'react';

export default class BreakdownItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
        	name: props.name,
        	owner: props.owner
        }
        this.clickEvent = this.clickEvent.bind(this);
    }
    
    clickEvent() {
    	console.log("clicked on " + this.state.name);
    	// FIXME should we pass in the whole state here ??
    	this.props.moveItemRandomly(this.state.name);
    }

    render() {
        return (
            <li onClick={this.clickEvent}><span className="label label-primary">{this.state.name}</span></li>
        );
    }
}