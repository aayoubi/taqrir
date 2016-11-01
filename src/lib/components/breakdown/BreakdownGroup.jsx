import React, { PropTypes } from 'react';

import BreakdownItem from './BreakdownItem.jsx';
import BreakdownGroupForm from './BreakdownGroupForm.jsx';
import {getUID} from '../../tools/utilities.js';


export default class BreakdownGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            label: props.label,
            /* items: [ {key: '', label: '', group: ''} ] */
            items: []
        }
        this.moveItemRandomly = this.moveItemRandomly.bind(this);
    }

    componentDidMount() {
        console.log(this.state.label + " is mounting, updating items");
        this.buildItemsList(this.props.items);
    }

    componentWillReceiveProps(newProps) {
        console.log(this.state.label + " received new props, updating items");
        this.buildItemsList(newProps.items);
    }

    moveItemRandomly(item) {
        console.log('--- clicked on ---' + item)
        console.log(item);
        console.log(this);
        console.log("removing item")
        const itemsUpdated = this.state.items;
        for(var i = 0; i < itemsUpdated.length; i++) {
            if(itemsUpdated[i].key === item.id) {
                itemsUpdated.splice(i, 1);
                this.setState({items: itemsUpdated})
            }
        }
        // console.log('--- group move ---')
        // this.props.moveItemRandomly(item, this.state.label);
    }

    buildItemsList(items) {
        const itemComponents = [];
        for(var i = 0 ; i < items.length ; i++) {
            const key = getUID();
            itemComponents.push({
                        key: key,
                        label: items[i],
                        group: this.state.label
                    }
                );
        }
        this.setState({items: itemComponents});
    }

    renderItems(items) {
        return items.map(function(item) {
            return (
                    <BreakdownItem
                        key={item.key}
                        id={item.key}
                        label={item.label}
                        group={item.group}
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
                    <h5>{this.props.label}</h5>
                    <hr/>
                    <ul className="breakdownGroup-body">
                        {this.renderItems(this.state.items)}
                    </ul>
                </div>
          </div>
        );
    }
}
