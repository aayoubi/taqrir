import React from 'react';
import Label from './chart/Label.jsx'
import PieChart from './chart/PieChart.jsx'
import DrillDownBarChart from './chart/DrillDownBarChart.jsx'

class UserTables extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var chartNodes = this.props.dataPerUser.map(function(userData) {
      var pieKey = userData.id
      var drilldownKey = userData.id + "drilldown"
      var firstName = userData.user.split(',')[1]
      var lastName = userData.user.split(',')[0]
      return (
        <div className="user" key={userData.id + "div"}>
          <Label title={firstName + " " + lastName} manDays={userData.md}/>
          <PieChart data={userData.chart} key={userData.id + "pie"} />
          <DrillDownBarChart seriesData={userData.drilldown.seriesData} drilldownData={userData.drilldown.drilldownData} key={userData.id + "drilldown"}/>
        </div>
      );
    });
    if(chartNodes.length == 0) {
      return (
        <div className="users"/>
      );
    } else {
      return (
        <div className="users">
          <h1>Team Members</h1>
          {chartNodes}
        </div>
      );
    }
  }
}

export default UserTables;