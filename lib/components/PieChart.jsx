define(function (require) {
    const React = require('react');
    const Utilities = require('lib/tools/utilities');

    const drawPieChart = function(parent, data) {
      $('#'+parent).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.2f}% {point.y:.2f} </b>'
        },
        series: [{
            name: "MD",
            colorByPoint: true,
            data: data
        }]
      });
    }


const PieChart = React.createClass({
    getInitialState: function() {
      return {uid: Utilities.getUID()};
    },
    componentDidMount: function() {
      drawPieChart(this.state.uid, this.props.data);
    },
    componentWillReceiveProps: function(nextProps) {
      drawPieChart(this.state.uid, nextProps.data);
    },
    render: function() {
      return (
        <div className="pieChart" id={this.state.uid} />
      );
    }
});

return PieChart;

});