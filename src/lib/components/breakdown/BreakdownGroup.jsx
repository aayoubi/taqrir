import React, { PropTypes } from 'react';

import BreakdownItems from './BreakdownItems.jsx';
import BreakdownGroupForm from './BreakdownGroupForm.jsx';

export default class BreakdownGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items:[]
        }
    }
    handleSubmitCallback(item) {
        const newItems = this.state.items;
        newItems.push(item.label)
        this.setState({items: newItems});
        console.log('item created', newItems);
    }
    render() {
        return (
          <div className="breakdownGroup">
                <div className="breakdownGroup-header">
                    <h5>{this.props.name}</h5>
                    <hr/>
                </div>
                <BreakdownItems items={this.props.items}/>
          </div>
        );
    }
}
