define(function (require) {
    const _ = require('underscore');
    const React = require('react');
    const FileSelector = require('jsx!lib/components/FileSelector');
    const TeamTable = require('jsx!lib/components/TeamTable');
    const UserTables = require('jsx!lib/components/UserTables');
    const Utilities = require('lib/tools/utilities');

    const MxTimeTable = React.createClass({
        getInitialState: function() {
          return {
            mxTimeDataTotal: [],
            totalManDays: 0,
            drilldownDataPerTeam: {},
            mxTimeDataByUser: []
          };
        },
        extractMxTimeData: function(data) {
          const totalManDays = _.reduce(data, function(m, e) { return m + e.waste; }, 0);
          const teamReportData = _.chain(data)
            .groupBy(function(e) { return e.activity; })
            .map(function(group, key) { return { "name": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
            .value();

          const groupedReportData = _.chain(data)
            .groupBy(function(e) { return e.activity.split('-')[0]; })
            .map(function(group, key) { return { "name": key, "drilldown": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
            .value();

          const groupedReportDrilldown = []
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

          const drilldownDataPerTeam = {
            "seriesData": groupedReportData,
            "drilldownData": groupedReportDrilldown
          }

          const mxTimeDataByUser = []
          _.chain(data)
            .map(function(e) { return e.user })
            .uniq()
            .each(function(user) {
              const reportDataPerUser = _.chain(data)
                .filter(function(e) { return e.user === user; })
                .value()

              const transformedReportDataPerUser = _.chain(reportDataPerUser)
                .filter(function(e) { return e.user === user; })
                .groupBy(function(e) { return e.activity; })
                .map(function(group, key) { return { "name": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
                .value()
              const userManDays = _.reduce(transformedReportDataPerUser, function(m, e) { return m + e.y; }, 0);

              const groupedReportDrilldownPerUser = []
              const groupedReportDataPerUser = _.chain(reportDataPerUser)
                .groupBy(function(e) { return e.activity.split('-')[0]; })
                .map(function(group, key) { return { "name": key, "drilldown": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
                .value();

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

              const drilldownDataPerUser= {
                "seriesData":groupedReportDataPerUser,
                "drilldownData": groupedReportDrilldownPerUser
              };

              mxTimeDataByUser.push({
                "id": Utilities.getUID(),
                "user": user,
                "data": transformedReportDataPerUser,
                "manDays": userManDays,
                "drilldownDataPerUser": drilldownDataPerUser
              })
            });

          this.setState({
            mxTimeDataTotal: teamReportData,
            totalManDays: totalManDays,
            drilldownDataPerTeam: drilldownDataPerTeam,
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
                    drilldownDataPerTeam={this.state.drilldownDataPerTeam}
                  />
                  <UserTables mxTimeDataByUser={this.state.mxTimeDataByUser} />
              </div>
          );
        }
    });
    return MxTimeTable;
});
