"use strict";

String.prototype.format = function () {
    var args = [].slice.call(arguments);
    return this.replace(/(\{\d+\})/g, function (a){
        return args[+(a.substr(1,a.length-2))||0];
    });
};

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function createChart(reportData, userName, manDays) {
    console.log("Creating chart " + userName + "...");
    var chartDivId = guid();
    $('#charts').append('<div id="{0}" class="left""></div>'.format(chartDivId));
    $('#' + chartDivId).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: userName + ' - Activities: ' + parseInt(manDays) + ' MD'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}% {point.y} </b>'
        },
        series: [{
            name: "MD",
            colorByPoint: true,
            data: reportData
        }]
    });
}

function errorHandler(evt) {
    switch(evt.target.error.code) {
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

function handleFileSelect(evt) {
    const reader = new FileReader();

    reader.onerror = errorHandler;

    reader.onabort = function(e) {
        alert('File read cancelled');
    };

    reader.onload = function(e) {
        const xmlDoc = $.parseHTML(this.result);
        const untidyReportData = []

        // entry[0]  -> username
        // entry[6]  -> activity date
        // entry[8]  -> activity label
        // entry[10] -> activity cost

        $.each($(xmlDoc).find('tr'), function(i, tr) {
            var entry = [];
            var tableData = $(this).find('td');
            if (tableData.length > 0) {
                tableData.each(function() { entry.push($(this).text()); });
                untidyReportData.push( {"user": entry[0], "activity": entry[8], "date": entry[6], "waste": parseFloat(entry[10]) } );
            }
        });

        _.chain(untidyReportData)
            .map(function(e) { return e.user })
            .uniq()
            .each(function(user) {
                var reportDataPerUser = _.chain(untidyReportData)
                .filter(function(e) { return e.user === user; })
                .groupBy(function(e) { return e.activity; })
                .map(function(group, key) { return { "name": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
                .value()
                var userManDays = _.reduce(reportDataPerUser, function(m, e) { return m + e.y; }, 0);
                createChart(reportDataPerUser, user, userManDays);
            });

        var totalManDays = _.reduce(untidyReportData, function(m, e) { return m + e.waste; }, 0);
        var tidyReportTotal = _.chain(untidyReportData)
            .groupBy(function(e) { return e.activity; })
            .map(function(group, key) { return { "name": key, "y": _(group).reduce(function(m, x) { return m + x.waste; }, 0) }; })
            .value()
        createChart(tidyReportTotal, "Total", totalManDays);
    };
    const files = evt.target.files; // FileList object
    reader.readAsText(files[0], "UTF-8");
}

(function() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
})();
