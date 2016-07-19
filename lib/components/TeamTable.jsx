define(function (require) {
    const React = require('react');
    const Label = require('jsx!lib/components/Label');
    const PieChart = require('jsx!lib/components/PieChart');
    const DrillDownBarChart = require('jsx!lib/components/DrillDownBarChart');
    const TeamTable = React.createClass({
      render: function() {
        console.log(this.props)
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
    });

  return TeamTable;
});
