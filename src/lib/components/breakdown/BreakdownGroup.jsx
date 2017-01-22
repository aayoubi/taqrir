import React, { PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import _ from 'underscore';

import BreakdownItem from './BreakdownItem.jsx';
import BreakdownGroupForm from './BreakdownGroupForm.jsx';
import {getUID} from '../../tools/utilities.js';

const Types = {
    ITEM: 'item'
};

const breakdownTarget = {
    drop(props, monitor, component) {
        props.moveBreakdownItem(monitor.getItem(), props);
    },

    canDrop(props, monitor, component) {
        return props.name != monitor.getItem().owner;
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

class BreakdownGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            items: []
        }
    }

    componentDidMount() {
        this.enhanceItemsList(this.props.items);
    }

    componentWillReceiveProps(newProps) {
        this.enhanceItemsList(newProps.items);
    }

    enhanceItemsList(items) {
        const groupName = this.state.name;
        const itemsWithOwners = _.map(this.props.items, function(e) {
            return { name: e, owner: groupName }
        });
        this.setState({ items: itemsWithOwners });
    }

    render() {
        // TODO the group title should be editable
        const items = _.map(this.state.items, function(e) {
            return (
                <BreakdownItem key={e.name} name={e.name} owner={e.owner} />
            );
        });

        const { canDrop, isOver, connectDropTarget } = this.props;
        const isActive = canDrop && isOver;
        let backgroundColor = '#E2E4E6';
        if (isActive) {
            backgroundColor = '#FFE4E6';
        }

        return connectDropTarget(
          <div className="breakdownGroup" style={{backgroundColor}}>
                <div className="breakdownGroup-header">
                    <h5>{this.state.name}</h5>
                    <hr/>
                </div>
                <ul className="breakdownGroup-body">
                    {items}
                </ul>
          </div>
        );
    }
}

export default DropTarget(Types.ITEM, breakdownTarget, collect)(BreakdownGroup);