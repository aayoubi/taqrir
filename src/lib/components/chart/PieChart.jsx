import React from 'react';
import $ from 'jquery';
import Highcharts from 'highcharts';
window.Highcharts = Highcharts;

import {getUID} from '../../tools/utilities.js';

function drawPieChart(parent, data) {
    Highcharts.chart(parent, {
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


class PieChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {uid: getUID()}
    }

    componentDidMount() {
      drawPieChart(this.state.uid, this.props.data);
    }

    componentWillReceiveProps(nextProps) {
      drawPieChart(this.state.uid, nextProps.data);
    }

    render() {
      return (
        <div className="pieChart" id={this.state.uid} />
      );
    }
}

export default PieChart;