import $ from 'jquery';
import _ from 'underscore';
import {getUID} from '../tools/utilities.js';

export function handleFileSelect(evt, callback) {
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
    }
  };

  reader.onabort = function(e) {
      alert('File read cancelled');
  };

  reader.onload = function(e) {
      const xmlDoc = $.parseHTML(this.result);
      const reportData = [];

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

export function cutAndSlice(data) {
  const totalManDays = _.reduce(data, function(m, e) { return m + e.waste; }, 0);
  const teamReportData = _.chain(data)
    .groupBy(function(e) { return e.activity; })
    .map(function(group, key) { return { "name": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
    .value();

  const breakdownsRaw = _.chain(data)
    .groupBy(function(e) { return e.activity.split('-')[0]; })
    .map(function(group, key) {
      const items = _.chain(group).map(function(e) { return e.activity; }).uniq().value();
      return { key: key, items: items };
    })
    .value();

  console.log(breakdownsRaw);
  const breakdowns = {};
  breakdownsRaw.forEach(function (breakdown) {
    breakdowns[breakdown.key] = breakdown.items;
  });
  console.log(breakdowns);

  const groupedReportData = _.chain(data)
    .groupBy(function(e) { return e.activity.split('-')[0]; })
    .map(function(group, key) { return { "name": key, "drilldown": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
    .value();

  const groupedReportDrilldown = [];
  _.chain(data)
    .groupBy(function(e) { return e.activity.split('-')[0]; })
    .each(function(group, key) {
      var project = { "name": key, "id": key, data: [] };
      project.data = _.chain(group)
          .groupBy(function(e) { return e.activity; })
          .map(function(group, key) { return [key, _(group).reduce(function(m, x) { return m + x.waste; }, 0) ]; })
          .value();
      groupedReportDrilldown.push(project);
    });

  const drilldownDataPerTeam = {
    "seriesData": groupedReportData,
    "drilldownData": groupedReportDrilldown
  };

  const mxTimeDataByUser = [];
  _.chain(data)
    .map(function(e) { return e.user; })
    .uniq()
    .each(function(user) {
      const reportDataPerUser = _.chain(data)
        .filter(function(e) { return e.user === user; })
        .value();

      const transformedReportDataPerUser = _.chain(reportDataPerUser)
        .filter(function(e) { return e.user === user; })
        .groupBy(function(e) { return e.activity; })
        .map(function(group, key) { return { "name": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
        .value();
      const userManDays = _.reduce(transformedReportDataPerUser, function(m, e) { return m + e.y; }, 0);

      const groupedReportDrilldownPerUser = [];
      const groupedReportDataPerUser = _.chain(reportDataPerUser)
        .groupBy(function(e) { return e.activity.split('-')[0]; })
        .map(function(group, key) { return { "name": key, "drilldown": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
        .value();

      _.chain(reportDataPerUser)
        .groupBy(function(e) { return e.activity.split('-')[0]; })
        .each(function(group, key) {
          var project = { "name": key, "id": key, data: [] };
          project.data = _.chain(group)
              .groupBy(function(e) { return e.activity; })
              .map(function(group, key) { return [key, _(group).reduce(function(m, x) { return m + x.waste; }, 0) ]; })
              .value();
          groupedReportDrilldownPerUser.push(project);
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
      });
    });

  return {
    mxTimeDataTotal: teamReportData,
    totalManDays: totalManDays,
    drilldownDataPerTeam: drilldownDataPerTeam,
    mxTimeDataByUser: mxTimeDataByUser,
    breakdowns: breakdowns
  };
}
