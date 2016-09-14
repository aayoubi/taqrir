import React, { PropTypes } from 'react';

export default class BreakdownItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <li><span className="label label-primary">{this.props.label}</span></li>
        );
    }
}