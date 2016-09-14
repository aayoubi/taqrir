import React, { PropTypes } from 'react';

import BreakdownGroup from './BreakdownGroup.jsx';

export default class Breakdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            groups:[]
        }
    }
    handleSubmitCallback() {
        // const i = this.state.index++;
        // this.state.groups.push({ index: i, key: i });
        // this.setState({groups: this.state.groups});
        console.log('group created');
    }
    render() {
        const groups = this.props.groups.map(function(group) {
            return (
                <BreakdownGroup key={group.key} name={group.key} items={group.items}/>
            );
        });
        return (
            <div className="containers">
                {groups}
            </div>
        );
    }
}