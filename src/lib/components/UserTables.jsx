import React from 'react';
import Label from './chart/Label.jsx'
import PieChart from './chart/PieChart.jsx'
import DrillDownBarChart from './chart/DrillDownBarChart.jsx'
import {extractWaste, extractPieChartData, extractDrilldownChartData} from '../tools/CustomDataExtractor.js';

class UserTables extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const userNodes = this.props.dataPerUser.map(function(user) {
      const waste = extractWaste(user.data)
      const pieChart = extractPieChartData(user.data);
      const drilldownChart = extractDrilldownChartData(user.data);
      const firstName = user.name.split(',')[1]
      const lastName = user.name.split(',')[0]
      return (
        <div className="user" key={user.id + "div"}>
          <Label title={firstName + " " + lastName} manDays={waste}/>
          <PieChart data={pieChart} key={user.id + "pie"} />
          <DrillDownBarChart seriesData={drilldownChart.seriesData} drilldownData={drilldownChart.drilldownData} key={user.id + "drilldown"}/>
        </div>
      );
    });
    if(userNodes.length == 0) {
      return (
        <div className="users"/>
      );
    } else {
      return (
        <div className="users">
          <h1>Team Members</h1>
          {userNodes}
        </div>
      );
    }
  }
}

export default UserTables;