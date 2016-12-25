import _ from 'underscore';
import React, { PropTypes } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import BreakdownGroup from './BreakdownGroup.jsx';
import {getUID} from '../../tools/utilities.js';


class Breakdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: []
        }
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

    renderGroup(i) {
        const key = getUID();
        return (
            <div key={i} className="groupp">
                <BreakdownGroup 
                    id={key} 
                    name={this.state.groups[i].name} 
                    items={this.state.groups[i].items} 
                    moveItemRandomly={this.moveItemRandomly} />
            </div>
        );
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


    render() {
        const groups = [];
        for(let i = 0; i < this.state.groups.length ; i++) {
            groups.push(this.renderGroup(i))
        }
        return (
            <div className="containers">
                {groups}
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(Breakdown);
