if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}

// React Class Hierarchy
//  - MxTimeTable
//      - FileSelector
//      - ActivityTables
//          - TeamTable
//          - UserTables
//              - Table
//              - Table
//              - Table

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
  handleChange: function(evt) {
    console.log(this);
    var onFileSelect = this.props.onFileSelect;
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
      <input type="file" id="files" onChange={this.handleChange}/>
    );
  }
});

var TeamTable = React.createClass({
  getInitialState: function() {
    return {mxTimeDataTotal: [], totalManDays: 0};
  },
  extractData: function(data) {
    var totalManDays = _.reduce(data, function(m, e) { return m + e.waste; }, 0);
    var teamReportData = _.chain(data)
        .groupBy(function(e) { return e.activity; })
        .map(function(group, key) { return { "name": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
        .value()
    this.setState({mxTimeDataTotal: teamReportData, totalManDays: totalManDays})
  },
  componentWillReceiveProps: function(nextProps) {
    this.extractData(nextProps.data);
  },
  render: function() {
    if(this.state.totalManDays === 0) {
      var chartNode = null;
    } else {
      var chartNode = (<PieChart title="Team" data={this.state.mxTimeDataTotal} manDays={this.state.totalManDays}/>);
    }
    return (
        <div className="teamTable">
          {chartNode}
        </div>
    );
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
              .groupBy(function(e) { return e.activity; })
              .map(function(group, key) { return { "name": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
              .value()
              var userManDays = _.reduce(reportDataPerUser, function(m, e) { return m + e.y; }, 0);
              mxTimeDataByUser.push({"id": getUID(), "user": user, "data": reportDataPerUser, "manDays": userManDays})
          });
      this.setState({mxTimeDataByUser: mxTimeDataByUser})
    },
    componentWillReceiveProps: function(nextProps) {
      this.extractData(nextProps.data);
    },
    render: function() {
        var chartNodes = this.state.mxTimeDataByUser.map(function(userData) {
          return (
            <PieChart title={userData.user} data={userData.data} manDays={userData.manDays} key={userData.id} />
          );
        });
        return (
          <div className="userTables">
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
      drawLineChart(this.state.uid, this.props.title, this.props.data, this.props.manDays);
    },
    componentWillReceiveProps: function(nextProps) {
      drawLineChart(this.state.uid, nextProps.title, nextProps.data, nextProps.manDays);
    },
    render: function() {
      return (
        <div className="chart" id={this.state.uid} />
      );
    }
});

ReactDOM.render(
  <MxTimeTable />,
  document.getElementById('content')
);

function drawLineChart(parent, title, data, manDays) {
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
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}% {point.y} </b>'
    },
    series: [{
        name: "MD",
        colorByPoint: true,
        data: data
    }]
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

