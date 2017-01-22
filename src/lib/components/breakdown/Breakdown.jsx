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
    
    componentWillReceiveProps(newProps){
        this.setState({ groups: newProps.groups })
    }
    
    moveBreakdownItem(item, dst) {
        const groups = this.state.groups;
        const src = _.find(groups, function(g) { return g.name === item.owner; })
        src.items = _.filter(src.items, function(e) { return e != item.name; });
        dst.items.push(item.name);
        this.setState({ groups: groups });
        // FIXME this is very slow...refreshes the whole thing
        this.props.onBreakdownChange(groups);
    }

    render() {
        const renderedGroups = _.map(this.state.groups, function(e) {
            return (
                <BreakdownGroup 
                    key={e.name}
                    name={e.name} 
                    items={e.items} 
                    moveBreakdownItem={this.moveBreakdownItem} />
            )
        }.bind(this));

        return (
            <div className="containers">
                {renderedGroups}
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(Breakdown);
