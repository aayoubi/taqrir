import React, { PropTypes } from 'react';

import BreakdownItem from './BreakdownItem.jsx';
import BreakdownGroupForm from './BreakdownGroupForm.jsx';
import {getUID} from '../../tools/utilities.js';


export default class BreakdownGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            label: props.label,
            items: []
        }
        this.moveItemRandomly = this.moveItemRandomly.bind(this);
    }

    componentDidMount() {
        console.log(this.state.label + " is mounting, updating items");
        this.buildItemsList(this.props.items);
    }

    componentWillReceiveProps(newProps){
        console.log(this.state.label + " received new props, updating items");
        this.buildItemsList(newProps.items);
    }

    moveItemRandomly(item) {
        console.log(item);
        console.log("moving randomly")
        console.log(this);
        this.props.moveItemRandomly(item, this.state.label);
    }

    removeItem() {

    }

    addItem() {

    }

    buildItemsList(items) {
        const itemComponents = [];
        for(var i = 0 ; i < items.length ; i++) {
            itemComponents.push(
                    <BreakdownItem 
                        key={getUID()}
                        label={items[i]}
                        group={this.state.label}
                        moveItemRandomly={this.moveItemRandomly} />
                );
        }
        this.setState({items: itemComponents});
    }

    render() {
        // TODO the group title should be editable
        console.log(this.state.items);
        return (
          <div className="breakdownGroup">
                <div className="breakdownGroup-header">
                    <h5>{this.props.label}</h5>
                    <hr/>
                    <ul className="breakdownGroup-body">
                        {this.state.items}
                    </ul>
                </div>
          </div>
        );
    }
}
