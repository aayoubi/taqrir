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
        for (let group in props.groups) {
            if(props.groups.hasOwnProperty(group)) {
                const key = getUID();
                groups.push({ 
                        key: key,
                        label: group,
                        items: props.groups[group]
                    }
                );
            }
        }
        this.setState({ groups: groups });
    }

    moveItemRandomly(item, group) {
        console.log('-- breakdown --');
        console.log(item);
        let newRandomDestinationGroup = null;
        while(newRandomDestinationGroup === group || newRandomDestinationGroup == null) {
            newRandomDestinationGroup = this.state.groups[Math.floor(this.state.groups.length * Math.random())];
        }
        console.log(newRandomDestinationGroup);
        console.log("moving randomly from [" + group + "] to [" + newRandomDestinationGroup + "]");
        console.log('-- breakdown --');
    }

    handleSubmitCallback() {
        console.log('group created');
    }

    renderGroups(groups) {
        return groups.map(function(group) {
            return (
                    <BreakdownGroup
                        key={group.key}
                        label={group.label}
                        items={group.items}
                        moveItemRandomly={this.moveItemRandomly}
                    />
                )
        }, this);
    }

    render() {
        return (
            <div className="containers">
                {this.renderGroups(this.state.groups)}
            </div>
        );
    }
}