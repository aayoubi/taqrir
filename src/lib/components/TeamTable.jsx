import React from 'react';
import Label from './chart/Label.jsx'
import PieChart from './chart/PieChart.jsx'
import DrillDownBarChart from './chart/DrillDownBarChart.jsx'

class TeamTable extends React.Component {
  constructor (props) {
    super(props);
  }
  render() {
    if(this.props.dataGlobal.chart !== undefined) {
      var chartNode = (
        <div className="team">
          <Label title="This team ♘" manDays={this.props.dataGlobal.md} />
          <PieChart data={this.props.dataGlobal.chart}/>
          <DrillDownBarChart 
            seriesData={this.props.dataGlobal.drilldown.seriesData} 
            drilldownData={this.props.dataGlobal.drilldown.drilldownData} />
        </div>
      );
      return chartNode;
    } else {
      return (null);
    }
  }
}

export default TeamTable;