import React, { PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

import BreakdownItem from './BreakdownItem.jsx';
import BreakdownGroupForm from './BreakdownGroupForm.jsx';
import {getUID} from '../../tools/utilities.js';

const Types = {
    ITEM: 'item'
};

const boxTarget = {
    drop(props, monitor, component) {
        console.log('dropping ');
        console.log(props);
        console.log(monitor);
        return {
            name: "ali" 
        };
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
            id: props.id,
            name: props.name,
            items: []
        }
    }

    componentDidMount() {
        this.buildItemsList(this.props.items);
    }

    componentWillReceiveProps(newProps) {
        this.buildItemsList(newProps.items);
    }

    buildItemsList(items) {
        const itemComponents = [];
        for(var i = 0 ; i < items.length ; i++) {
            const key = getUID();
            itemComponents.push({
                key: key,
                name: items[i],
                owner: this.state.name
            });
        }
        this.setState({items: itemComponents});
    }

    renderItem(i) {
        return (
            <BreakdownItem
                key={i}
                id={i}
                name={this.state.items[i].name}
                owner={this.state.items[i].owner}
            />
        );
    }

    render() {
        // TODO the group title should be editable
        const items = [];
        for(let i = 0; i < this.state.items.length ; i++) {
            items.push(this.renderItem(i))
        }
        const { connectDropTarget, isOver } = this.props;

        return connectDropTarget(
          <div className="breakdownGroup">
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

export default DropTarget(Types.ITEM, boxTarget, collect)(BreakdownGroup);