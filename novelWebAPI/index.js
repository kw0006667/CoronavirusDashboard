const TOTAL_COUNT = 50;
var totalCount;
var filterCount = 50;
var currentCount;

var cache = {};
var cases_data_cache = {};
var deaths_data_cache = {};
var allCountriesConfirmed = [];
var allCountriesTodayCases = [];
var allCountriesDeaths = [];
var allCountriesTodayDeaths = [];

var AllCountries = [];
var TotalCases = [];
var TotalDeaths = [];
var TodayCases = [];
var TodayCases_Chart = [];
var TodayDeaths_Chart = [];
var temp = [];

var countryCasesArray = [];
var countriesTotalCasesForBubbleArray = [];
var countriesTotalDeathsForBubbleArray = [];
var countriesTodayCasesForBubbleArray = [];
var countriesTodayDeathsForBubbleArray = [];

var currentSearch = '';


initialized();

function initialized() {
    let searchInput = document.getElementById('search');
    searchInput.oninput = function(event) {
        currentSearch = this.value;
        chart.series.forEach(serie => {
            serie.points.forEach(point => {
                point.update({ color: Highcharts.theme.colors[point.colorIndex] }, false);
            });
        });
        chart.redraw();

        if (currentSearch !== '') {
            filterTable(currentSearch);
            chart.series.forEach(serie => {
                serie.points.forEach(point => {
                    if (point.name.includes(currentSearch)) {
                        // We don't need too select any point here because we only fade out other points.
                        // point.select(true, true);
                    } else {
                        point.update({ color: Highcharts.theme.colors[point.colorIndex] + '11' }, false);
                    }
                });
            });
        } else {
            clearTableStatus();
        }
    };

    bubbleChartInitialize();
    chart.showLoading();

    getAllDataByNovelWebAPI()
        .then(data => {
            return data.json();
        })
        .then(res => {
            if (res) {
                completeAllDataArraysForNewEndpoint(res);
                bubbleChartRender();
                // showDataTable();
                showTable();
                chart.hideLoading();
            }
        })
        .catch(error => console.error('Error: ' + error));
}

function completeAllDataArraysForNewEndpoint(res) {
    totalCount = res.length;

    let tableBody = document.getElementById('statusTable').getElementsByTagName('tbody')[0];

    for (let index = 0; index < res.length; index++) {
        let countryName = res[index].country;
        let totalCases = res[index].cases;
        let totalDeaths = res[index].deaths;
        let todayCases = res[index].todayCases;
        let todayDeaths = res[index].todayDeaths;
        countriesTotalCasesForBubbleArray.push({ name: countryName, value: totalCases > 0 ? totalCases : null });
        countriesTotalDeathsForBubbleArray.push({ name: countryName, value: totalDeaths > 0 ? totalDeaths : null });
        countriesTodayCasesForBubbleArray.push({ name: countryName, value: todayCases > 0 ? todayCases : null });
        countriesTodayDeathsForBubbleArray.push({ name: countryName, value: todayDeaths > 0 ? todayDeaths : null });
        addNewRowToTable(tableBody, countryName, totalCases, totalDeaths, todayCases, todayDeaths);
    }
}