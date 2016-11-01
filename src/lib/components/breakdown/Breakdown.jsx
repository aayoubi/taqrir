import _ from 'underscore';
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
        props.groups.forEach(function(group) {
            const key = getUID();
            groups.push({ 
                    key: key,
                    id: key,
                    name: group.name,
                    items: group.items
                }
            );
        });
        this.setState({ groups: groups });
    }

    moveItemRandomly(item, group) {
        console.log('-- breakdown --');
        console.log(item);
        console.log(group);
        const groups = this.state.groups;
        const sourceGroup = _.find(groups, function(g) { return g.name === group; })
        const destinationGroup = _.sample(groups);
        console.log(sourceGroup);
        console.log(destinationGroup);
        // add to dest
        destinationGroup.items.push(item);
        // remove from src
        for(var i = 0; i < sourceGroup.items.length; i++) {
            if(sourceGroup.items[i] === item) {
                sourceGroup.items.splice(i, 1);
            }
        }
        this.setState({ groups: groups });
        this.props.onBreakdownChange(groups);
    }

    handleSubmitCallback() {
        console.log('group created');
    }

    renderGroups(groups) {
        return groups.map(function(group) {
            const key = getUID();
            return (
                    <BreakdownGroup
                        key={key}
                        id={key}
                        name={group.name}
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