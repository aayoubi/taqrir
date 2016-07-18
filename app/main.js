// React Class Hierarchy
//  - MxTimeTable
//      - FileSelector
//      - DateFilter
//      - DynamicBreakdowns
//      - TeamTable
//        - PieChart
//        - DrillDownBarChart
//      - UserTables
//        - User
//          - PieChart
//          - DrillDownBarChart
//        ...

require.config({
  baseUrl : '../',
  paths: {
    "jquery": "bower_components/jQuery/dist/jquery.min",
    "underscore": "bower_components/underscore/underscore-min",
    "highcharts": "bower_components/highcharts/highcharts",
    "highcharts-drilldown": "bower_components/highcharts/modules/drilldown",
    "react": "bower_components/react/react-with-addons",
    "react-dom": "bower_components/react/react-dom.min",
    "babel": "bower_components/requirejs-react-jsx/babel-5.8.34.min",
    "jsx": "bower_components/requirejs-react-jsx/jsx",
    "text": "bower_components/requirejs-text/text"
  },

  shim : {
    "react": {
      "exports": "React"
    }
  },

  config: {
    babel: {
      sourceMaps: "inline", // One of [false, 'inline', 'both']. See https://babeljs.io/docs/usage/options/
      fileExtension: ".jsx" // Can be set to anything, like .es6 or .js. Defaults to .jsx
    }
  }
});

require(['jsx!lib/app'], function(App){
  var app = new App();
  app.init();
});


/*
const FileSelector = React.createClass({
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
      <div className="fileSelector">
        <input type="file" id="files" onChange={this.onChange}/>
      </div>
    );
  }
});

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

const UserTables = React.createClass({
    render: function() {
        var chartNodes = this.props.mxTimeDataByUser.map(function(userData) {
          var pieKey = userData.id
          var drilldownKey = userData.id + "drilldown"
          var firstName = userData.user.split(',')[1]
          var lastName = userData.user.split(',')[0]
          return (
            <div className="user" key={userData.id + "div"}>
              <Label title={firstName + " " + lastName} manDays={userData.manDays}/>
              <PieChart data={userData.data} key={userData.id + "pie"} />
              <DrillDownBarChart seriesData={userData.groupedReportDataPerUser} drilldownData={userData.groupedReportDrilldownPerUser} key={userData.id + "drilldown"}/>
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

const Label = React.createClass({
    render: function() {
      return (
        <div className="label">
          <h3>{this.props.title}</h3>
          <p>spent {this.props.manDays.toFixed(2)} days working.</p>
        </div>
      );
    }
});

const PieChart = React.createClass({
    getInitialState: function() {
      return {uid: getUID()};
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

const DrillDownBarChart = React.createClass({
    getInitialState: function() {
      return {uid: getUID()};
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

ReactDOM.render(
  <MxTimeTable />,
  document.getElementById('content')
);

function drawPieChart(parent, data) {
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
*/
