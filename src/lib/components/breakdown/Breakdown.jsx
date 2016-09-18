import React, { PropTypes } from 'react';

import BreakdownGroup from './BreakdownGroup.jsx';
import {getUID} from '../../tools/utilities.js';

export default class Breakdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: []
        }
        this.moveItemRandomly = this.moveItemRandomly.bind(this);
    }
    componentDidMount() {
        this.buildGroupsList(this.props);
    }
    componentWillReceiveProps(newProps){
        this.buildGroupsList(newProps);
    }
    buildGroupsList(props) {
        console.log("building breakdowns...")
        const groups = []
        for (let key in props.groups) {
            if(props.groups.hasOwnProperty(key)) {
                groups.push(<BreakdownGroup 
                    key={getUID()}
                    label={key}
                    items={props.groups[key]}
                    moveItemRandomly={this.moveItemRandomly} />
                );
            }
        }
        this.setState({ groups: groups });
    }
    moveItemRandomly(item, group) {
        let newRandomDestinationGroup = null;
        while(newRandomDestinationGroup === group || newRandomDestinationGroup == null) {
            newRandomDestinationGroup = this.state.groups[Math.floor(this.state.groups.length * Math.random())];
        }
        console.log(newRandomDestinationGroup);
        console.log("moving randomly from [" + group + "] to [" + newRandomDestinationGroup + "]");
    }
    handleSubmitCallback() {
        console.log('group created');
    }
    render() {
        return (
            <div className="containers">
                {this.state.groups}
            </div>
        );
    }
}