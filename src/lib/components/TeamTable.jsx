import _ from 'underscore';
import React from 'react';

import Label from './chart/Label.jsx';
import PieChart from './chart/PieChart.jsx';
import DrillDownBarChart from './chart/DrillDownBarChart.jsx';
import {extractWaste, extractPieChartData, extractDrilldownChartData} from '../tools/CustomDataExtractor.js';


class TeamTable extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    const waste = extractWaste(this.props.dataGlobal)
    const pieChart = extractPieChartData(this.props.dataGlobal);
    const drilldownChart = extractDrilldownChartData(this.props.dataGlobal);

    return (
      <div className="team">
        <Label title="This team ♘" manDays={waste} />
        <PieChart data={pieChart}/>
        <DrillDownBarChart 
          seriesData={drilldownChart.seriesData} 
          drilldownData={drilldownChart.drilldownData} />
      </div>
    );
  }
}

export default TeamTable;