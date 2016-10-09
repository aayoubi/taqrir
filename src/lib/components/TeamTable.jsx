import React from 'react';
import Label from './chart/Label.jsx'
import PieChart from './chart/PieChart.jsx'
import DrillDownBarChart from './chart/DrillDownBarChart.jsx'

class TeamTable extends React.Component {
  constructor (props) {
    super(props);
  }
  render() {
    if(this.props.dataPerTeam.length > 0) {
      var chartNode = (
        <div className="team">
          <Label title="This team ♘" manDays={this.props.dataPerTeam.md} />
          <PieChart data={this.props.dataPerTeam.chart}/>
          <DrillDownBarChart seriesData={this.props.dataPerTeam.drilldown.seriesData} drilldownData={this.props.dataPerTeam.drilldown.drilldownData} />
        </div>
      );
      return chartNode;
    } else {
      return (null);
    }
  }
}

export default TeamTable;