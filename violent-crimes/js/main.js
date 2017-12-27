$(document).ready(function() {
    _init('CA')
});

function _init(defaultState) {
    if (defaultState) { generateCharts(defaultState); }

    $('select').change(function(){
        var stateAbbrev = this.value;
        generateCharts(stateAbbrev);
    });
}

// function _appendPageTitles (stateName, increaseOrDecline) {
//     $('#title').text(stateName + '\'s violent crime rate ' + increaseOrDecline + ' overall between 2006 and 2016.');
//     $('#category-title').text('Change in ' + stateName + '\'s Violent Crime Rate (Incidents per 100,000 Residents) by Category, 2006–2016')
//     $('#bar-chart-title').text('Change in ' + stateName + '\'s Overall Violent Crime Rate (Incidents per 100,000 Residents) by Population Area, 2006–2016');
// }
// end area chart

// Line chart
function generateCharts (stateAbbrev) {
    var stateName, percentChange, crimeData, arrestData;
    var stateName = _getStateName(stateAbbrev);
    _appendPageTitles(stateName);
    var arrestsCSV = 'data/arrests-crime.csv';
    var crimesCSV = 'data/reported-crime.csv';
    _createDashboardChart(stateAbbrev, arrestsCSV, crimesCSV, 'arrests-chart', _createLineChart)

    var homocideArrestsCSV = 'data/homocide-arrests.csv';
    var homocideCrimesCSV = 'data/homocide-crime.csv';
    var rapeArrestsCSV = 'data/rape-arrests.csv';
    var rapeCrimesCSV = 'data/rape-crime.csv';
    var robberyArrestsCSV = 'data/robbery-arrests.csv';
    var robberyCrimesCSV = 'data/robbery-crime.csv';
    var assaultArrestsCSV = 'data/assault-arrests.csv';
    var assaultCrimesCSV = 'data/assault-crime.csv';
    var drugDataCSV = 'data/drug-arrest.csv';
    var nonIndexDataCSV = 'data/non-index-arrest.csv';

    _createDashboardChart(stateAbbrev, homocideArrestsCSV, homocideCrimesCSV, 'homocide', _createLineChart);
    _createDashboardChart(stateAbbrev, rapeArrestsCSV, rapeCrimesCSV, 'rape', _createLineChart);
    _createDashboardChart(stateAbbrev, robberyArrestsCSV, robberyCrimesCSV, 'robbery', _createLineChart);
    _createDashboardChart(stateAbbrev, assaultArrestsCSV, assaultCrimesCSV, 'aggravated-assault', _createLineChart);

    _createDashboardChart(stateAbbrev, drugDataCSV, nonIndexDataCSV, 'drug-area-chart', _createAreaChart);

    // add this --> _appendPercentChange('#arrests-chart-percent-change', percentChange);
}

function _createDashboardChart(stateAbbrev, arrestsCSV, crimesCSV, id, createChart) {
    var crimeData, arrestData;
    var arrestReq = $.get(arrestsCSV, function (csv) {
        var data = _csvToArray(csv);
        for (var i = 0; i < data.length; i++) {
            if (data[i][1] == stateAbbrev) {
                percentChange = data[i][data[i].length - 1];
                arrestData = _formatStateData(data[i]);
            }
        }
    });
    var crimeReq = $.get(crimesCSV, function (csv) {
        var data = _csvToArray(csv);
        for (var i = 0; i < data.length; i++) {
            if (data[i][1] == stateAbbrev) {
                percentChange = data[i][data[i].length - 1];
                crimeData = _formatStateData(data[i]);
            }
        }
    });

    $.when(crimeReq, arrestReq).done(function() {
        var stateName = _getStateName(stateAbbrev);
        createChart(stateName, crimeData, arrestData, id);
    });
}

function _appendPageTitles (stateName) {
    $('#title').text('Arrests for violent crimes in ' + stateName + ' followed similar trends as for reported crime');
    $('#category-title').text('Change in ' + stateName + '\'s Violent Crimes and Arrests (Volume) by Offense Category, 2006–2016');
    // $('#bar-chart-title').text('Change in ' + stateName + '\'s Overall Violent Crime Rate (Incidents per 100,000 Residents) by Population Area, 2006–2016');
}

function _appendPercentChange (id, percentChange) {
    $(id).text(percentChange);
}

function _createLineChart (stateName, crimeData, arrestData, chartId) {
  function _getLineChartTitle (chartId, stateName) {
    if (chartId == 'arrests-chart') {
        return 'Overall Violent Crime and Arrests in ' + stateName + ' (Volume), 2006–2016'
    } else if (chartId == 'aggravated-assault') {
        return 'Aggravated Assault';
    } else {
        return chartId.charAt(0).toUpperCase() + chartId.slice(1);
    }
  }
    var title = _getLineChartTitle(chartId, stateName);
    var myChart = Highcharts.chart(chartId, {
        chart: {
            type: 'line'
        },
        title: {
            text: title
        },
        xAxis: {
            categories: ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016']
        },
        legend: {
            enabled: false
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        series: [{
            name: stateName,
            data: crimeData,
        },
        {
            name: stateName,
            data: arrestData,
            color: '#f05a22'
        }]
    });
}

function _createAreaChart (stateName, drugData, otherData, chartId) {
    var myChart = Highcharts.chart(chartId, {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Change in ' + stateName + '\'s Non-Index Crime Arrests (Volume) by Offense, 2006–2016'
        },
        xAxis: {
            categories: ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016']
        },
        legend: {
            enabled: false
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        series: [{
            name: stateName,
            data: drugData,
            color: '#fbd813',
            fillOpacity: 1
          },
          {
            name: stateName,
            data: otherData,
            color: '#f05a22',
            fillOpacity: 1
        }],
    });
}

function _getStateName(stateAbbrev) {
    switch (stateAbbrev) {
      case 'AL':
        return 'Alabama'
        break;
      case 'AK':
        return 'Alaska'
        break;
      case 'AZ':
        return 'Arizona'
        break;
      case 'AR':
        return 'Arkansas'
        break;
      case 'CA':
        return 'California'
        break;
      case 'CO':
        return 'Colorado'
        break;
      case 'CT':
        return 'Connecticut'
        break;
      case 'DE':
        return 'Delaware'
        break;
      case 'FL':
        return 'Florida'
        break;
      case 'GA':
        return 'Georgia'
        break;
      case 'HI':
        return 'Hawaii'
        break;
      case 'ID':
        return 'Idaho'
        break;
      case 'IL':
        return 'Illinois'
        break;
      case 'IN':
        return 'Indiana'
        break;
      case 'IA':
        return 'Iowa'
        break;
      case 'KS':
        return 'Kansas'
        break;
      case 'KY':
        return 'Kentucky'
        break;
      case 'LA':
        return 'Louisiana'
        break;
      case 'ME':
        return 'Maine'
        break;
      case 'MD':
        return 'Maryland'
        break;
      case 'MA':
        return 'Massachusetts'
        break;
      case 'MI':
        return 'Michigan'
        break;
      case 'MN':
        return 'Minnesota'
        break;
      case 'MS':
        return 'Mississippi'
        break;
      case 'MO':
        return 'Missouri'
        break;
      case 'MT':
        return 'Montana'
        break;
      case 'NE':
        return 'Nebraska'
        break;
      case 'NV':
        return 'Nevada'
        break;
      case 'NH':
        return 'New Hampshire'
        break;
      case 'NJ':
        return 'New Jersey'
        break;
      case 'NM':
        return 'New Mexico'
        break;
      case 'NY':
        return 'New York'
        break;
      case 'NC':
        return 'North Carolina'
        break;
      case 'ND':
        return 'North Dakota'
        break;
      case 'OH':
        return 'Ohio'
        break;
      case 'OK':
        return 'Oklahoma'
        break;
      case 'OR':
        return 'Oregon'
        break;
      case 'PA':
        return 'Pennsylvania'
        break;
      case 'RI':
        return 'Rhode Island'
        break;
      case 'SC':
        return 'South Carolina'
        break;
      case 'SD':
        return 'South Dakota'
        break;
      case 'TN':
        return 'Tennessee'
        break;
      case 'TX':
        return 'Texas'
        break;
      case 'UT':
        return 'Utah'
        break;
      case 'VT':
        return 'Vermont'
        break;
      case 'VA':
        return 'Virginia'
        break;
      case 'WA':
        return 'Washington'
        break;
      case 'WV':
        return 'West Virginia'
        break;
      case 'WI':
        return 'Wisconsin'
        break;
      case 'WY':
        return 'Wyoming'
        break;
    }

}

function _csvToArray (csv) {
    rows  = csv.split("\n");
    return rows.map(function (row) {
        return row.split(",");
    });
};

function _formatStateData (data) {
    data.splice(0, 2);
    data.splice(-1, 1);
    data = data.map(Number);
    return data;
}
