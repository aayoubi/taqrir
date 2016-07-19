define(function (require) {
    const React = require('react');
    const Label = require('jsx!lib/components/Label');
    const PieChart = require('jsx!lib/components/PieChart');
    const DrillDownBarChart = require('jsx!lib/components/DrillDownBarChart');

	const UserTables = React.createClass({
	    render: function() {
	        var chartNodes = this.props.mxTimeDataByUser.map(function(userData) {
	          var pieKey = userData.id
	          var drilldownKey = userData.id + "drilldown"
	          var firstName = userData.user.split(',')[1]
	          var lastName = userData.user.split(',')[0]
	          console.log(userData)
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
	});

	return UserTables;
});