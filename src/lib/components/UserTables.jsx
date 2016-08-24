import React from 'react';
import Label from './chart/Label.jsx'
import PieChart from './chart/PieChart.jsx'
import DrillDownBarChart from './chart/DrillDownBarChart.jsx'

class UserTables extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var chartNodes = this.props.mxTimeDataByUser.map(function(userData) {
      var pieKey = userData.id
      var drilldownKey = userData.id + "drilldown"
      var firstName = userData.user.split(',')[1]
      var lastName = userData.user.split(',')[0]
      return (
        <div className="user" key={userData.id + "div"}>
          <Label title={firstName + " " + lastName} manDays={userData.manDays}/>
          <PieChart data={userData.data} key={userData.id + "pie"} />
          <DrillDownBarChart seriesData={userData.drilldownDataPerUser.seriesData} drilldownData={userData.drilldownDataPerUser.drilldownData} key={userData.id + "drilldown"}/>
        </div>
      );
    });
    return (
      <div className="users">
        <h1>Team Members</h1>
        {chartNodes}
      </div>
    );
  }
}

export default UserTables;