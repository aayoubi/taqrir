import React, { PropTypes } from 'react';

export default class BreakdownGroupForm extends React.Component {
	handleSubmit(e) {
	    e.preventDefault();
	    this.props.callback();
		console.log('created a new group');
	}
    render() {
        return (
          <form className="breakdownForm" onSubmit={this.handleSubmit}>
	        <input type="submit" value="Create new group" />
          </form>
        );
    }
}

