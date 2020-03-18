var chart;

function initializeMap() {
    chart = Highcharts.mapChart('container', {
        chart: {
            map: 'custom/world'
        },
        title: {
            text: 'Coronavirus Dashboard'
        },
        subtitle: {
            text: ''
        },
        legend: {
            enabled: true
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },
        series: [{
            name: 'Countries',
            color: '#e0e0e0',
            showInLegend: false,
            enabledMouseTracking: false
        }, {
            type: 'mapbubble',
            name: 'Confirmed Cases',
            joinBy: ['iso-a2', 'code'],
            data: [],
            minSize: 8,
            maxSize: '15%',
            tooltip: {
                useHTML: true,
                pointFormat: '{point.name}<br>Total cases: {point.z}<br>Total Deaths: {point.totalDeaths}<br>Today Cases: {point.todayCases}<br>Today Deaths: {point.todayDeaths}'
            }
        }]
    });
}

function renderMap() {
    chart.series[1].setData(mapData, true);
}