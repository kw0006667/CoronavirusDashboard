const TOTAL_COUNT = 50;

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

    getAllData()
        .then(data => {
            return data.json();
        })
        .then(res => {
            if (res) {
                cases_data_cache = res.confirmed;
                deaths_data_cache = res.deaths;
                generateAllCountriesCases();
                generateAllCountriesDeaths();
                completeAllDataArrays();
                // barChartRender();

                showDataTable();
                bubbleChartRender();
                chart.hideLoading();
            }
        })
        .catch(error => console.error('Error:' + error));
}

// Including All Cases and today cases
function generateAllCountriesCases() {
    let dateStrings = getDateString();
    let todayString = dateStrings.todayString;
    let yesterdayString = dateStrings.yesterdayString;

    cases_data_cache.locations.forEach(country => {
        if (!country.province.includes(',')) {
            let totalCases = Number.parseInt(country.history[todayString]);
            let todayCases = Number.parseInt(country.history[todayString]) - Number.parseInt(country.history[yesterdayString]);
            let countryName = country.country.includes('Taiwan') ? 'Taiwan' : country.country;

            // Total confirmed cases
            if (allCountriesConfirmed[countryName]) {
                allCountriesConfirmed[countryName] += isNaN(totalCases) ? 0 : totalCases;
            } else {
                allCountriesConfirmed[countryName] = isNaN(totalCases) ? 0 : totalCases;
            }

            // Today confirmed cases
            if (allCountriesTodayCases[countryName]) {
                allCountriesTodayCases[countryName] += isNaN(todayCases) ? 0 : todayCases;
            } else {
                allCountriesTodayCases[countryName] = isNaN(todayCases) ? 0 : todayCases;
            }
        }
    });

    for (const country in allCountriesConfirmed) {
        if (allCountriesConfirmed.hasOwnProperty(country)) {
            const cases = allCountriesConfirmed[country];
            temp.push({
                name: country,
                confirmed: cases
            });
        }
    }

    temp.sort((a, b) => b.confirmed - a.confirmed);
}

function generateAllCountriesDeaths() {
    let dateStrings = getDateString();
    let todayString = dateStrings.todayString;
    let yesterdayString = dateStrings.yesterdayString;

    deaths_data_cache.locations.forEach(country => {
        if (!country.province.includes(',')) {
            let totalDeaths = Number.parseInt(country.history[todayString]);
            let todayDeaths = Number.parseInt(country.history[todayString]) - Number.parseInt(country.history[yesterdayString]);
            let countryName = country.country.includes('Taiwan') ? 'Taiwan' : country.country;

            // Total deaths
            if (allCountriesDeaths[countryName]) {
                allCountriesDeaths[countryName] += isNaN(totalDeaths) ? 0 : totalDeaths;
            } else {
                allCountriesDeaths[countryName] = isNaN(totalDeaths) ? 0 : totalDeaths;
            }

            // Today deaths
            if (allCountriesTodayDeaths[countryName]) {
                allCountriesTodayDeaths[countryName] += isNaN(todayDeaths) ? 0 : todayDeaths;
            } else {
                allCountriesTodayDeaths[countryName] = isNaN(todayDeaths) ? 0 : todayDeaths;
            }
        }
    });
}

function getDateString() {
    let today = new Date();
    let todayString = (today.getMonth() + 1) + '/' + (today.getDate() - 1) + '/' + (today.getFullYear().toString().substr(-2));
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date);
    let yesterdayString = (yesterday.getMonth() + 1) + '/' + (yesterday.getDate() - 1) + '/' + (yesterday.getFullYear().toString().substr(-2));

    return {
        todayString: todayString,
        yesterdayString: yesterdayString
    };
}

function completeAllDataArrays() {
    let count = TOTAL_COUNT;
    temp.forEach(t => {
        if (count === 0) {
            return;
        }
        let countryName = t.name;
        if (countryName !== 'China') {
            AllCountries.push(countryName);
            TotalCases.push(allCountriesConfirmed[countryName]);
            TodayCases_Chart.push(allCountriesTodayCases[countryName]);
            TotalDeaths.push(allCountriesDeaths[countryName]);
            TodayDeaths_Chart.push(allCountriesTodayDeaths[countryName]);

            // for Bubble
            let totalCases = allCountriesConfirmed[countryName];
            let totalDeaths = allCountriesDeaths[countryName];
            let todayCases = allCountriesTodayCases[countryName];
            let todayDeaths = allCountriesTodayDeaths[countryName];
            if (totalCases > 0)
                countriesTotalCasesForBubbleArray.push({ name: countryName, value: allCountriesConfirmed[countryName] });
            if (totalDeaths > 0)
                countriesTotalDeathsForBubbleArray.push({ name: countryName, value: allCountriesDeaths[countryName] });
            if (todayCases > 0)
                countriesTodayCasesForBubbleArray.push({ name: countryName, value: allCountriesTodayCases[countryName] });
            if (todayDeaths > 0)
                countriesTodayDeathsForBubbleArray.push({ name: countryName, value: allCountriesTodayDeaths[countryName] });
            count--;
        }
    });

    temp = null;
}

function generateData() {
    data.forEach(item => {
        // if (c < 0) {
        //     return;
        // }
        if (item.todayCases > 0 || item.todayDeaths > 0) {
            AllCountries.push(item.country);
            TotalCases.push(item.todayCases);
            TotalDeaths.push(item.todayDeaths);
        }

        if (item.todayCases > 0) {
            countriesTotalCasesForBubbleArray.push({ name: item.country, value: item.todayCases });
        }
        if (item.todayDeaths > 0) {
            countriesTotalDeathsForBubbleArray.push({ name: item.country, value: item.todayDeaths });
        }

        // c--;
    });


    // data.forEach(item => {
    //     if (item.todayCases > 0) {
    //         countriesCasesForBubbleArray.push({ name: item.country, value: item.todayCases });
    //     }
    //     if (item.todayDeaths > 0) {
    //         countriesDeathsForBubbleArray.push({ name: item.country, value: item.todayDeaths });
    //     }
    // });
    // data.forEach(item => {
    //     countryCasesArray.push({ name: item.country, value: item.cases });
    // });
}