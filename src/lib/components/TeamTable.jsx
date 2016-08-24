import React from 'react';
import Label from './chart/Label.jsx'
import PieChart from './chart/PieChart.jsx'
import DrillDownBarChart from './chart/DrillDownBarChart.jsx'

class TeamTable extends React.Component {
  constructor (props) {
    super(props);
  }
  render() {
    var chartNode = (
      <div className="team">
        <Label title="This team" manDays={this.props.totalManDays} />
        <PieChart data={this.props.mxTimeDataTotal}/>
        <DrillDownBarChart seriesData={this.props.drilldownDataPerTeam.seriesData} drilldownData={this.props.drilldownDataPerTeam.drilldownData} />
      </div>
    );
    if (this.props.totalManDays === 0)
      return (null);
    else
      return chartNode;
  }
}

export default TeamTable;