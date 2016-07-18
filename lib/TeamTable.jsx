define(function (require) {
    const React = require('react');
    const Label = require('jsx!lib/Label');
    const PieChart = require('jsx!lib/PieChart');
    const DrillDownBarChart = require('jsx!lib/DrillDownBarChart');
    const TeamTable = React.createClass({
      render: function() {
        var chartNode = (
          <div className="team">
            <Label title="This team" manDays={this.props.totalManDays} />
            <PieChart data={this.props.mxTimeDataTotal}/>
            <DrillDownBarChart seriesData={this.props.groupedReportData} drilldownData={this.props.groupedReportDrilldown} />
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
