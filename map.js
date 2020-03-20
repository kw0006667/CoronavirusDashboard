var chart;

function initializeMap() {
    chart = Highcharts.mapChart('container', {
        chart: {
            map: 'custom/world-highres',
            // height: '100%'
        },
        title: {
            useHTML: true,
            text: 'Coronavirus Dashboard'
        },
        subtitle: {
            useHTML: true,
            text: '<span style="color: gray;">data source: <span><a href="https://github.com/NovelCOVID/API">NovelCOVID/API</a>'
        },
        xAxis: {
            minRange: 5
        },
        yAxis: {
            minRange: 5
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
            enabledMouseTracking: false,
        }, {
            type: 'mapbubble',
            name: 'Confirmed Cases',
            joinBy: ['iso-a2', 'code'],
            showInLegend: false,
            data: [],
            minSize: 8,
            maxSize: '15%',
            allowPointSelect: true,
            cursor: 'pointer',
            states: {
                select: {

                }
            },
            tooltip: {
                useHTML: true,
                pointFormat: '{point.name}<br>Total cases: {point.z}<br>Total Deaths: {point.totalDeaths}<br>Total Recovered: {point.totalRecovered}' //Today Cases: {point.todayCases}<br>Today Deaths: {point.todayDeaths}'
            }
        }]
    });
}

function renderMap() {
    chart.series[1].setData(mapData, true);
}