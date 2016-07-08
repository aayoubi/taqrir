// React Class Hierarchy
//  - MxTimeTable
//      - FileSelector
//      - TeamTable
//        - PieChart
//        - BarChart
//      - UserTables
//        - User
//          - PieChart
//          - BarChart
//        ...

var MxTimeTable = React.createClass({
  getInitialState: function() {
    return {mxTimeData: []};
  },
  handleFileSelect: function(data) {
    this.setState({mxTimeData: data});
  },
  render: function() {
    return (
        <div className="mxTimeTable">
            <FileSelector onFileSelect={this.handleFileSelect} />
            <TeamTable data={this.state.mxTimeData} />
            <UserTables data={this.state.mxTimeData} />
        </div>
    );
  }
});

var FileSelector = React.createClass({
  onChange: function(evt) {
    var callback = function(status, data) {
      if (status === 'error') {
        console.log('Failed to read and parse the provided mxtime report');
        this.props.onFileSelect([]);
      } else {
        this.props.onFileSelect(data);
      }
    }.bind(this);
    handleFileSelect(evt, callback);
  },
  render: function() {
    return (
      <input type="file" id="files" onChange={this.onChange}/>
    );
  }
});

var TeamTable = React.createClass({
  getInitialState: function() {
    return {mxTimeDataTotal: [], totalManDays: 0, groupedReportData: [], groupedReportDrilldown: []};
  },
  extractData: function(data) {
    var totalManDays = _.reduce(data, function(m, e) { return m + e.waste; }, 0);
    var teamReportData = _.chain(data)
        .groupBy(function(e) { return e.activity; })
        .map(function(group, key) { return { "name": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
        .value();

    var groupedReportData = _.chain(data)
        .groupBy(function(e) { return e.activity.split('-')[0]; })
        .map(function(group, key) { return { "name": key, "drilldown": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
        .value();

    var groupedReportDrilldown = []
    _.chain(data)
        .groupBy(function(e) { return e.activity.split('-')[0]; })
        .each(function(group, key) {
          var project = { "name": key, "id": key, data: [] }
          project.data = _.chain(group)
              .groupBy(function(e) { return e.activity; })
              .map(function(group, key) { return [key, _(group).reduce(function(m, x) { return m + x.waste; }, 0) ]; })
              .value()
          groupedReportDrilldown.push(project)
        });

    this.setState({
        mxTimeDataTotal: teamReportData,
        totalManDays: totalManDays,
        groupedReportData: groupedReportData,
        groupedReportDrilldown: groupedReportDrilldown})
  },
  componentWillReceiveProps: function(nextProps) {
    this.extractData(nextProps.data);
  },
  render: function() {
    var chartNode = (
      <div className="team">
        <PieChart title="Team" data={this.state.mxTimeDataTotal} manDays={this.state.totalManDays}/>
        <BarChart title="Team" seriesData={this.state.groupedReportData} drilldownData={this.state.groupedReportDrilldown} />
      </div>
    );
    console.log(this)
    if (this.state.totalManDays === 0)
      return (null);
    else
      return chartNode;
  }
});

var UserTables = React.createClass({
    getInitialState: function() {
      return {mxTimeDataByUser: []};
    },
    extractData: function(data) {
      var mxTimeDataByUser = []
      _.chain(data)
          .map(function(e) { return e.user })
          .uniq()
          .each(function(user) {
              var reportDataPerUser = _.chain(data)
                .filter(function(e) { return e.user === user; })
                .value()

              var transformedReportDataPerUser = _.chain(reportDataPerUser)
                .filter(function(e) { return e.user === user; })
                .groupBy(function(e) { return e.activity; })
                .map(function(group, key) { return { "name": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
                .value()
              var userManDays = _.reduce(transformedReportDataPerUser, function(m, e) { return m + e.y; }, 0);

              var groupedReportDataPerUser = _.chain(reportDataPerUser)
                .groupBy(function(e) { return e.activity.split('-')[0]; })
                .map(function(group, key) { return { "name": key, "drilldown": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
                .value();

              var groupedReportDrilldownPerUser = []
              _.chain(reportDataPerUser)
                .groupBy(function(e) { return e.activity.split('-')[0]; })
                .each(function(group, key) {
                  var project = { "name": key, "id": key, data: [] }
                  project.data = _.chain(group)
                      .groupBy(function(e) { return e.activity; })
                      .map(function(group, key) { return [key, _(group).reduce(function(m, x) { return m + x.waste; }, 0) ]; })
                      .value()
                  groupedReportDrilldownPerUser.push(project)
                });
              mxTimeDataByUser.push({
                "id": getUID(),
                "user": user,
                "data": transformedReportDataPerUser,
                "manDays": userManDays,
                "groupedReportDataPerUser": groupedReportDataPerUser,
                "groupedReportDrilldownPerUser": groupedReportDrilldownPerUser
              })
          });
      this.setState({mxTimeDataByUser: mxTimeDataByUser})
    },
    componentWillReceiveProps: function(nextProps) {
      this.extractData(nextProps.data);
    },
    render: function() {
        var chartNodes = this.state.mxTimeDataByUser.map(function(userData) {
          console.log(userData)
          var pieKey = userData.id
          var drilldownKey = userData.id + "drilldown"
          return (
            <div className="user" key={userData.id + "div"}>
              <PieChart title={userData.user} data={userData.data} manDays={userData.manDays} key={userData.id + "pie"} />
              <BarChart title={userData.user} seriesData={userData.groupedReportDataPerUser} drilldownData={userData.groupedReportDrilldownPerUser} key={userData.id + "drilldown"}/>
            </div>
          );
        });
        return (
          <div className="users">
            {chartNodes}
          </div>
        );

    }
});

var PieChart = React.createClass({
    getInitialState: function() {
      return {uid: getUID()};
    },
    componentDidMount: function() {
      drawPieChart(this.state.uid, this.props.title, this.props.data, this.props.manDays);
    },
    componentWillReceiveProps: function(nextProps) {
      drawPieChart(this.state.uid, nextProps.title, nextProps.data, nextProps.manDays);
    },
    render: function() {
      return (
        <div className="pieChart" id={this.state.uid} />
      );
    }
});

var BarChart = React.createClass({
    getInitialState: function() {
      return {uid: getUID()};
    },
    componentDidMount: function() {
      drawDrilldownBarChart(this.state.uid, this.props.title, this.props.seriesData, this.props.drilldownData);
    },
    componentWillReceiveProps: function(nextProps) {
      drawDrilldownBarChart(this.state.uid, nextProps.title, nextProps.seriesData, nextProps.drilldownData);
    },
    render: function() {
      return (
        <div className="barChart" id={this.state.uid} />
      );
    }
});

ReactDOM.render(
  <MxTimeTable />,
  document.getElementById('content')
);

function drawPieChart(parent, title, data, manDays) {
  $('#'+parent).highcharts({
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: title + ' - Activities: ' + parseInt(manDays) + ' MD'
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

function drawDrilldownBarChart(parent, title, seriesData, drilldownData) {
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

function getUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return 'a' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function handleFileSelect(evt, callback) {
    const reader = new FileReader();

    reader.onerror = function(e) {
      switch(e.target.error.code) {
          case evt.target.error.NOT_FOUND_ERR:
              alert('File Not Found!');
              break;
          case evt.target.error.NOT_READABLE_ERR:
              alert('File is not readable');
              break;
          case evt.target.error.ABORT_ERR:
              break;
          default:
              alert('An error occurred reading this file.');
      };
    }

    reader.onabort = function(e) {
        alert('File read cancelled');
    };

    reader.onload = function(e) {
        const xmlDoc = $.parseHTML(this.result);
        const reportData = []

        // entry[0]  -> username
        // entry[6]  -> activity date
        // entry[8]  -> activity label
        // entry[10] -> activity cost

        try {
          $.each($(xmlDoc).find('tr'), function(i, tr) {
              var entry = [];
              var tableData = $(this).find('td');
              if (tableData.length > 0) {
                  tableData.each(function() { entry.push($(this).text()); });
                  reportData.push( {"user": entry[0], "activity": entry[8], "date": entry[6], "waste": parseFloat(entry[10]) } );
              }
          });
        } catch (err) {
          callback('error', []);
        }
        callback('success', reportData);
    };
    const files = evt.target.files; // FileList object
    reader.readAsText(files[0], "UTF-8");
}

