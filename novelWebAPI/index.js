const TOTAL_COUNT = 50;
var totalCouint = 50;

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
                showDataTable();
                bubbleChartRender();
                chart.hideLoading();
            }
        })
        .catch(error => console.error('Error: ' + error));
}

function completeAllDataArraysForNewEndpoint(res) {
    let countLimit = TOTAL_COUNT;
    res.forEach(country => {
        if (countLimit === 0) {
            return;
        }
        let countryName = country.country;
        let totalCases = country.cases;
        let totalDeaths = country.deaths;
        let todayCases = country.todayCases;
        let todayDeaths = country.todayDeaths;
        if (totalCases > 0)
            countriesTotalCasesForBubbleArray.push({ name: countryName, value: totalCases });
        if (totalDeaths > 0)
            countriesTotalDeathsForBubbleArray.push({ name: countryName, value: totalDeaths });
        if (todayCases > 0)
            countriesTodayCasesForBubbleArray.push({ name: countryName, value: todayCases });
        if (todayDeaths > 0)
            countriesTodayDeathsForBubbleArray.push({ name: countryName, value: todayDeaths });

        countLimit--;
    });

}