import React from 'react';
import _ from 'underscore';

import {getUID} from '../tools/utilities.js';
import FileSelector from './FileSelector.jsx';
import TeamTable from './TeamTable.jsx';
import UserTables from './UserTables.jsx';


class ActivityTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mxTimeDataTotal: [],
            totalManDays: 0,
            drilldownDataPerTeam: {},
            mxTimeDataByUser: [],
            breakdowns: []
        }
        this.handleFileSelect = this.handleFileSelect.bind(this);
    }

    extractMxTimeData (data) {
      const totalManDays = _.reduce(data, function(m, e) { return m + e.waste; }, 0);
      const teamReportData = _.chain(data)
        .groupBy(function(e) { return e.activity; })
        .map(function(group, key) { return { "name": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
        .value();

      const breakdowns = _.chain(data)
        .groupBy(function(e) { return e.activity.split('-')[0]; })
        .map(function(group, key) {
          const items = _.chain(group).map(function(e) { return e.activity; }).uniq().value()
          return { key: key, items: items}
        })
        .value()

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
            "id": getUID(),
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
        mxTimeDataByUser: mxTimeDataByUser,
        breakdowns: breakdowns
      });
    }

    handleFileSelect(data) {
      this.extractMxTimeData(data);
    }

    render() {
              // <Breakdown groups={this.state.breakdowns}/>
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
}

export default ActivityTable;
