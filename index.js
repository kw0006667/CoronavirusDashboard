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
var mapData = [];

var currentSearch = '';


initialized();

function initialized() {
    let searchInput = document.getElementById('search');
    searchInput.oninput = function(event) {
        currentSearch = this.value;
        // chart.series.forEach(serie => {
        //     serie.points.forEach(point => {
        //         point.update({ color: Highcharts.theme.colors[point.colorIndex] }, false);
        //     });
        // });
        // chart.redraw();

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

    // bubbleChartInitialize();
    initializeMap();
    chart.showLoading();

    getAllDataV2()
        .then(data => {
            return data.json();
        })
        .then(res => {
            if (res) {
                let locations = res.locations;
                generateAllLocationsData(locations);
                // cases_data_cache = res.confirmed;
                // deaths_data_cache = res.deaths;
                // generateAllCountriesCases();
                // generateAllCountriesDeaths();
                // completeAllDataArrays();
                // barChartRender();

                // showDataTable();
                renderMap();
                showTable();
                // bubbleChartRender();
                chart.hideLoading();
            }
        })
        .catch(error => console.error('Error:' + error));
}

function generateAllLocationsData(locations) {
    locations.forEach(location => {
        if (!location.province.includes(',')) {
            if (!AllCountries[location.country_code]) {
                AllCountries[location.country_code] = {
                    name: location.country,
                    code: location.country_code,
                    z: location.latest.confirmed,
                    totalDeaths: location.latest.deaths,
                    totalRecovered: location.latest.recovered,
                    todayCases: 0,
                    todayDeaths: 0
                };
            } else {
                AllCountries[location.country_code].z += location.latest.confirmed;
                AllCountries[location.country_code].totalDeaths += location.latest.deaths;
                AllCountries[location.country_code].totalRecovered += location.latest.recovered;
            }
        }
    });

    // AllCountries.sort((a, b) => { console.log(b.z); return b.z - a.z; });

    let tableBody = document.getElementById('statusTable').getElementsByTagName('tbody')[0];

    for (const country in AllCountries) {
        if (AllCountries.hasOwnProperty(country)) {
            const location = AllCountries[country];
            mapData.push(location);

        }
    }

    mapData.sort((a, b) => { return b.z - a.z; });
    mapData.forEach(location => {
        let countryName = location.name;
        let totalCases = location.z;
        let totalDeaths = location.totalDeaths;
        let todayCases = location.todayCases;
        let todayDeaths = location.todayDeaths;
        let totalRecovered = location.totalRecovered;
        addNewRowToTable(tableBody, countryName, totalCases, totalDeaths, todayCases, todayDeaths, totalRecovered);
    });
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

        // for Bubble chart type
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
    });

    temp = null;
}