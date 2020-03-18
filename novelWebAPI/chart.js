var chart;

function bubbleChartInitialize() {
    chart = Highcharts.chart('container', {
        chart: {
            type: 'packedbubble',
            load: function() {
                this.series.forEach(bubbles => {
                    bubbles.forEach(bubble => {
                        if (bubble.name.includes(currentSearch)) {
                            bubble.select();
                        }
                    });
                });
            }
        },
        title: {
            text: 'Coronavirus Dashboard'
        },
        subtitle: {
            text: 'Coronavirus Status (Only first 50 countires)'
        },
        tooltip: {
            useHTML: true,
            pointFormat: '<b>{point.name}:</b> {point.value} cases'
        },
        boost: {
            useGPUTranslations: true,
            usePreAllocated: true
        },
        plotOptions: {
            packedbubble: {
                boostThreshold: 100,
                minSize: '50%',
                maxSize: '150%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    splitSeries: false,
                    gravitationalConstant: 0.02,
                },
                dataLabels: {
                    enabled: true,
                    useHTML: true,
                    format: '<b>{point.name}</b></br>{point.value} cases',
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 1
                    },
                    style: {
                        fontSize: '12px',
                        color: 'black',
                        textOutline: 'none',
                        fontWeight: 'normal'
                    }
                }
            }
        },
        series: [{
                name: 'Total Cases',
                data: []
            },
            {
                name: 'Total Deaths',
                data: []
            },
            {
                name: 'Today Cases',
                data: []
            },
            {
                name: 'Today Deaths',
                data: []
            }
        ]
    });
}

function barChartRender() {
    chart = new Highcharts.chart('container', {
        chart: {
            type: 'bar',
            // height: '100%',
            options3d: {
                enabled: true,
                alpha: 5,
                beta: 15,
                viewDistance: 25,
                depth: 60
            }
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
                skew3d: true,
                style: {
                    fontSize: '12px'
                }
            }
        },
        yAxis: {
            min: 0,
            minorTickInterval: 0,
            tickInterval: 5000,
            title: {
                text: 'Coronavirus Status (Only first 50 countires)'
            }
        },
        plotOptions: {
            series: {
                minPointLength: 10,
                dataLabels: [{
                    enabled: true,
                    format: '{y}'
                }],
                stacking: 'normal',
                depth: 40
            }
        },
        series: [{
            name: 'Total Cases',
            data: TotalCases
        }, {
            name: 'Total Deaths',
            data: TotalDeaths
        }, {
            name: 'Today Cases',
            data: TodayCases_Chart
        }, {
            name: 'Today Deaths',
            data: TodayDeaths_Chart
        }]
    });
}

function bubbleChartRender() {
    // TODO: add this function as a callback function and register it into RequestAnimationFrame to improve the performance.
    // if (countriesTotalCasesForBubbleArray.length > 0) {
    //     let cases = countriesTotalCasesForBubbleArray.pop();
    //     let series = chart.series[0];
    //     series.addPoint([cases.name, cases.value], true, true);
    // }
    // if (countriesTotalDeathsForBubbleArray.length > 0) {
    //     chart.series[1].addPoint(countriesTotalDeathsForBubbleArray.pop(), true, true);
    // }
    // if (countriesTodayCasesForBubbleArray.length > 0) {
    //     chart.series[2].addPoint(countriesTodayCasesForBubbleArray.pop(), true, true);
    // }
    // if (countriesTodayDeathsForBubbleArray.length > 0) {
    //     chart.series[3].addPoint(countriesTodayDeathsForBubbleArray.pop(), true, true);
    // }

    // if (countriesTotalCasesForBubbleArray.length > 0 ||
    //     countriesTotalDeathsForBubbleArray.length > 0 ||
    //     countriesTodayCasesForBubbleArray.length > 0 ||
    //     countriesTodayDeathsForBubbleArray.length > 0) {
    //     window.requestAnimationFrame(bubbleChartRender);
    // }

    chart.series[0].setData(countriesTotalCasesForBubbleArray.slice(0, TOTAL_COUNT));
    chart.series[1].setData(countriesTotalDeathsForBubbleArray.slice(0, TOTAL_COUNT));
    chart.series[2].setData(countriesTodayCasesForBubbleArray.slice(0, TOTAL_COUNT));
    chart.series[3].setData(countriesTodayDeathsForBubbleArray.slice(0, TOTAL_COUNT));
    currentCount = TOTAL_COUNT;
    if (filterCount > TOTAL_COUNT) {
        addBubbleTask();
    }
}

function addBubbleTask() {
    if (currentCount < filterCount) {
        if (currentCount < countriesTotalCasesForBubbleArray.length) {
            let cases = countriesTotalCasesForBubbleArray[currentCount - 1];
            chart.series[0].addPoint([cases.name, cases.value], false, false);
        }
        if (currentCount < countriesTotalDeathsForBubbleArray.length) {
            let deaths = countriesTotalDeathsForBubbleArray[currentCount - 1];
            chart.series[1].addPoint([deaths.name, deaths.value], false, false);
        }
        if (currentCount < countriesTodayCasesForBubbleArray.length) {
            let todayCase = countriesTodayCasesForBubbleArray[currentCount - 1];
            chart.series[2].addPoint([todayCase.name, todayCase.value], false, false);
        }
        if (currentCount < countriesTodayDeathsForBubbleArray.length) {
            let todayDeath = countriesTodayDeathsForBubbleArray[currentCount - 1];
            chart.series[3].addPoint([todayDeath.name, todayDeath.value], false, false);
        }
        currentCount++;

        window.requestAnimationFrame(addBubbleTask);
    } else {
        chart.redraw();
    }
}

function showDataTable() {
    chart.update({ exporting: { showTable: true } });
}