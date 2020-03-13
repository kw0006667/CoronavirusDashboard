function barChartRender() {
    var chart = new Highcharts.chart('container', {
        chart: {
            type: 'bar',
            // height: '100%',
            // options3d: {
            //     enabled: true,
            //     alpha: 5,
            //     beta: 15,
            //     viewDistance: 25,
            //     depth: 60
            // }
        },
        title: {
            text: 'Coronavirus Dashboard'
        },
        subtitle: {
            text: 'Coronavirus Status'
        },
        tooltip: {
            useHTML: true,
            pointFormat: '<center>{point.y} cases</center>',
            // formatter: function() {
            //     return '<b>' + this.x + '</b></br>' +
            //         this.series.name + ': ' + this.y + '</br>' +
            //         'Total: ' + (this.point.stackTotal - this.y);
            // }
        },
        xAxis: {
            categories: AllCountries,
            labels: {
                // skew3d: true,
                style: {
                    fontSize: '12px'
                }
            }
        },
        // yAxis: {
        //     min: 0,
        //     minorTickInterval: 1,
        //     tickInterval: 1000,
        //     title: {
        //         text: 'Coronavirus Status'
        //     }
        // },
        plotOptions: {
            series: {
                dataLabels: [{
                    enabled: true,
                    format: '{y}'
                }],
                stacking: 'normal',
                // depth: 60
            }
        },
        series: [{
            name: 'Total Cases',
            data: TotalCases,
            stack: 'cases'
        }, {
            name: 'Total Deaths',
            data: TotalDeaths,
            stack: 'deaths'
        }, {
            name: 'Today Cases',
            data: TodayCases_Chart,
            stack: 'cases'
        }, {
            name: 'Today Deaths',
            data: TodayDeaths_Chart,
            stack: 'deaths'
        }]
    });
}

function bubbleChartRender() {
    var chart = new Highcharts.chart('container', {
        chart: {
            type: 'packedbubble',
        },
        title: {
            text: 'Coronavirus Dashboard'
        },
        tooltip: {
            useHTML: true,
            pointFormat: '{point.name}: {point.y}'
        },

        plotOptions: {
            packedbubble: {
                minSize: '60%',
                maxSize: '400%',
                zMin: 0,
                zMax: 10000,
                layoutAlgorithm: {
                    splitSeries: false,
                    gravitationalConstant: 0.002
                },
                dataLabels: {
                    enabled: true,
                    useHTML: true,
                    format: '{point.name}<br><center>{point.value}</center></br>',
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 0
                    },
                    style: {
                        color: 'black',
                        textOutline: 'none',
                        fontWeight: 'normal'
                    }
                }
            }
        },

        series: [{
            name: 'Today Cases',
            data: TodayCases
        }]
    });
}