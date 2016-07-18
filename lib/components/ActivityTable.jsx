define(function (require) {
    const React = require('react');
    const FileSelector = require('jsx!lib/FileSelector');
    const TeamTable = require('jsx!lib/TeamTable');
    const UserTables = require('jsx!lib/UserTables');
    const _ = require('underscore');
    const Utilities = require('lib/utilities');

    const MxTimeTable = React.createClass({
        getInitialState: function() {
          return {
            mxTimeDataTotal: [],
            totalManDays: 0,
            groupedReportData: [],
            groupedReportDrilldown: [],
            mxTimeDataByUser: []
          };
        },
        extractMxTimeData: function(data) {
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
                "id": Utilities.getUID(),
                "user": user,
                "data": transformedReportDataPerUser,
                "manDays": userManDays,
                "groupedReportDataPerUser": groupedReportDataPerUser,
                "groupedReportDrilldownPerUser": groupedReportDrilldownPerUser
              })
            });

          this.setState({
            mxTimeDataTotal: teamReportData,
            totalManDays: totalManDays,
            groupedReportData: groupedReportData,
            groupedReportDrilldown: groupedReportDrilldown,
            mxTimeDataByUser: mxTimeDataByUser
          });
        },
        handleFileSelect: function(data) {
          this.extractMxTimeData(data);
        },
        render: function() {
          return (
              <div className="mxTimeTable">
                  <FileSelector onFileSelect={this.handleFileSelect} />
                  <TeamTable
                    totalManDays={this.state.totalManDays}
                    mxTimeDataTotal={this.state.mxTimeDataTotal}
                    groupedReportData={this.state.groupedReportData}
                    groupedReportDrilldown={this.state.groupedReportDrilldown}
                  />
                  <UserTables mxTimeDataByUser={this.state.mxTimeDataByUser} />
              </div>
          );
        }
    });
    return MxTimeTable;
});



