import React, { PropTypes } from 'react';
import { DragSource } from 'react-dnd';

const Types = {
    ITEM: 'item'
};

const itemSource = {
    beginDrag(props, monitor, component) {
        return {
            'name': props.name,
            'owner': props.owner
        };
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    };
}

class BreakdownItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            owner: props.owner
        }
    }
    
    render() {
        const { isDragging, connectDragSource } = this.props;
        const opacity = isDragging ? 0.1 : 1;

        return connectDragSource (
            <li style={{opacity}}>
                <span className="label label-primary">{this.state.name}</span>
            </li>
        );
    }
}

export default DragSource(Types.ITEM, itemSource, collect)(BreakdownItem);