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
        this.moveBreakdownItem = this.moveBreakdownItem.bind(this);
    }
    
    componentDidMount() {
        // FIXME 20170122: again, why am I doing this? cf. BreakdownGroup.componentDidMount()
        this.buildGroupsList(this.props.groups);
    }

    componentWillReceiveProps(newProps){
        this.buildGroupsList(newProps.groups);
    }
    
    buildGroupsList(groups) {
        console.log("building breakdowns...")
        const g = []
        for(let i = 0; i < groups.length ; i++) {
            g.push({ 
                    name: groups[i].name,
                    items: groups[i].items
                });
        }
        this.setState({ groups: g });
    }

    renderGroup(i) {
        const group = this.state.groups[i];
        return (
            <BreakdownGroup 
                key={group.name}
                name={group.name} 
                items={group.items} 
                moveBreakdownItem={this.moveBreakdownItem} />
        );
    }

    moveBreakdownItem(item, dst) {
        const groups = this.state.groups;
        const src = _.find(groups, function(g) { return g.name === item.owner; })
        // remove from src
        for(let i = 0; i < src.items.length; i++) {
            if(src.items[i] === item.name) {
                src.items.splice(i, 1);
            }
        }
        // push to dst
        dst.items.push(item.name);
        // update the whole state
        this.setState({ groups: groups });
        // FIXME this is very slow...refreshes the whole thing
        this.props.onBreakdownChange(groups);
    }


    render() {
        const renderedGroups = [];
        for(let i = 0; i < this.state.groups.length ; i++) {
            renderedGroups.push(this.renderGroup(i))
        }
        return (
            <div className="containers">
                {renderedGroups}
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(Breakdown);
