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

export function extractDrilldownChartData(data) {
    const highchartsData = _.chain(data)
        .groupBy(function(e) { return e.activity.split('-')[0]; })
        .map(function(group, key) {
            return { "name": key, "drilldown": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; 
        })
        .value();

    const highchartsDrilldownData = [];
    _.chain(data)
        .groupBy(function(e) { return e.activity.split('-')[0]; })
        .each(function(group, key) {
            var project = { "name": key, "id": key, "data": [] };
            project.data = _.chain(group)
                .groupBy(function(e) { return e.activity; })
                .map(function(group, key) { 
                    return [key, _(group).reduce(function(m, x) { return m + x.waste; }, 0) ]; 
                })
                .value();
            highchartsDrilldownData.push(project);
        });

    return {
        "seriesData": highchartsData,
        "drilldownData": highchartsDrilldownData
    };
}

export function extractWaste(data) {
    return _.reduce(data, function(m, e) { return m + e.waste; }, 0);
}

export function extractPieChartData(data) {
    return _.chain(data)
        .groupBy(function(e) { return e.activity; })
        .map(function(group, key) { return { "name": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
        .value();
}

function extractDrilldownData(activities, breakdowns) {
    const seriesData = []
    const drilldownData = []
    breakdowns.forEach(function(breakdown) {
        const series = { "name": breakdown.name, "drilldown": breakdown.name, "y": 0 } ;
        const drilldown = { "id": breakdown.name, "data": [] } ;
        activities.forEach(function(activity) {
            if(breakdown.items.indexOf(activity.name) >= 0) {
                series.y += activity.y;
                drilldown.data.push([activity.name, activity.y]);
            }
        })
        seriesData.push(series);
        drilldownData.push(drilldown);
    });
    return {
        "seriesData": seriesData,
        "drilldownData": drilldownData
    };
}

function createBreakdowns(data) {
    const breakdowns = _.chain(data)
        .groupBy(function(e) { return e.activity.split('-')[0]; })
        .map(function(group, key) {
            const items = _.chain(group).map(function(e) { return e.activity; }).uniq().value();
            return { "name": key, "items": items };
        })
        .value();
    console.log('breakdowns');
    console.log(breakdowns);
    return breakdowns;
}

function retrieveDataPerUser(data) {
    const dataPerUser = [];
    _.chain(data)
        .map(function(e) { return e.user; })
        .uniq()
        .each(function(user) {
            const rawDataPerUser = _.chain(data)
                .filter(function(e) { return e.user === user; })
                .value();
            dataPerUser.push({
                "id": getUID(),
                "name": user,
                "data": rawDataPerUser
            });
        });
    return dataPerUser;
}

export function cutAndSlice(data) {
    const dataPerUser = retrieveDataPerUser(data);
    const breakdowns = createBreakdowns(data);

    return {
        dataGlobal: data,
        dataPerUser: dataPerUser,
        breakdowns: breakdowns
    };
}
