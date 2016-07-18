define(function (require) {
    const React = require('react');
    const Highcharts = require('highcharts')
    const Utilities = require('lib/utilities');

    const drawDrilldownBarChart = function(parent, seriesData, drilldownData) {
      // FIXME fix drilldown button position
      $('#'+parent).highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'category'
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.2f}'
                    }
                }
            },
            credits: {
              enabled: false
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b><br/>'
            },
            series: [{
                name: 'Projects',
                colorByPoint: true,
                data: seriesData,
            }],
            drilldown: {
                series: drilldownData
            }
        });
    }

    const DrillDownBarChart = React.createClass({
        getInitialState: function() {
          return {uid: Utilities.getUID()};
        },
        componentDidMount: function() {
          drawDrilldownBarChart(this.state.uid, this.props.seriesData, this.props.drilldownData);
        },
        componentWillReceiveProps: function(nextProps) {
          drawDrilldownBarChart(this.state.uid, nextProps.seriesData, nextProps.drilldownData);
        },
        render: function() {
          return (
            <div className="barChart" id={this.state.uid} />
          );
        }
    });

    return DrillDownBarChart;
});