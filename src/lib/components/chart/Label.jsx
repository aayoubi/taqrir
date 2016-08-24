import React from 'react';

class Label extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
      return (
        <div className="desc">
          <h3>{this.props.title}</h3>
          <p>spent {this.props.manDays.toFixed(2)} days working.</p>
        </div>
      );
    }
}

export default Label;