import React, { PropTypes } from 'react';

import BreakdownItem from './BreakdownItem.jsx';
import BreakdownGroupForm from './BreakdownGroupForm.jsx';
import {getUID} from '../../tools/utilities.js';


export default class BreakdownGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            name: props.name,
            items: []
        }
        this.moveItemRandomly = this.moveItemRandomly.bind(this);
    }

    componentDidMount() {
        this.buildItemsList(this.props.items);
    }

    componentWillReceiveProps(newProps) {
        this.buildItemsList(newProps.items);
    }

    moveItemRandomly(item) {
        console.log('--- clicked on ---' + item)
        // FIXME should we pass the whole state here as well ???
        this.props.moveItemRandomly(item, this.state.name);
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

    renderItems(items) {
        return items.map(function(item) {
            return (
                    <BreakdownItem
                        key={item.key}
                        id={item.key}
                        name={item.name}
                        owner={item.owner}
                        moveItemRandomly={this.moveItemRandomly}
                    />
                )
        }, this);
    }

    render() {
        // TODO the group title should be editable
        return (
          <div className="breakdownGroup">
                <div className="breakdownGroup-header">
                    <h5>{this.props.name}</h5>
                    <hr/>
                    <ul className="breakdownGroup-body">
                        {this.renderItems(this.state.items)}
                    </ul>
                </div>
          </div>
        );
    }
}
