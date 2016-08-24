import React from 'react';
import $ from 'jquery';
import Highcharts from 'highcharts';
// https://github.com/highcharts/highcharts/issues/4994
window.Highcharts = Highcharts;
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/drilldown')(Highcharts);

import {getUID} from '../../tools/utilities.js';

function drawDrilldownBarChart(parent, seriesData, drilldownData) {
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

class DrillDownBarChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {uid: getUID()}
    }

    componentDidMount() {
      drawDrilldownBarChart(this.state.uid, this.props.seriesData, this.props.drilldownData);
    }

    componentWillReceiveProps(nextProps) {
      drawDrilldownBarChart(this.state.uid, nextProps.seriesData, nextProps.drilldownData);
    }

    render() {
      return (
        <div className="barChart" id={this.state.uid} />
      );
    }
}

export default DrillDownBarChart;