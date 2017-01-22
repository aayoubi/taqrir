import React, { PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

import BreakdownItem from './BreakdownItem.jsx';
import BreakdownGroupForm from './BreakdownGroupForm.jsx';
import {getUID} from '../../tools/utilities.js';

const Types = {
    ITEM: 'item'
};

const breakdownTarget = {
    drop(props, monitor, component) {
        console.log('dropping in group');
        console.log(monitor.getItem());
        console.log('---');
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
        // FIXME 20170122: why am i doing this? can't I handle the render updates in a different way?
        // eno i'm calling setState on each componentDidMount, it seems counterintuitive to me!
        this.buildItemsList(this.props.items);
    }

    componentWillReceiveProps(newProps) {
        this.buildItemsList(newProps.items);
    }

    buildItemsList(items) {
        const list_of_items = [];
        for(let i = 0 ; i < items.length ; i++) {
            list_of_items.push({
                name: items[i],
                owner: this.state.name
            });
        }
        this.setState({ items: list_of_items });
    }

    renderItem(i) {
        const name = this.state.items[i].name;
        const owner = this.state.items[i].owner;
        return (
            <BreakdownItem key={name} name={name} owner={owner} />
        );
    }

    render() {
        // TODO the group title should be editable
        const items = [];
        for(let i = 0; i < this.state.items.length ; i++) {
            items.push(this.renderItem(i))
        }
        const { canDrop, isOver, connectDropTarget } = this.props;
        const isActive = canDrop && isOver;

        let backgroundColor = '#E2E4E6';
        if (isActive) {
            backgroundColor = '#FFE4E6';
        }

        return connectDropTarget(
          <div className="breakdownGroup" style={{backgroundColor}}>
                <div className="breakdownGroup-header">
                    <h5>{this.props.name}</h5>
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