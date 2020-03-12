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

var countryCasesArray = [];
var countriesCasesForBubbleArray = [];
var countriesDeathsForBubbleArray = [];

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
            barChartRender();

            // bubbleChartRender();
        }
    })
    .catch(error => console.error('Error:' + error));


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

    let temp = [];
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
            count--;
        }
    });
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

            if (country.country === "US") {
                console.log(country.province + ': ' + (isNaN(todayDeaths) ? 0 : todayDeaths));
            }
        }
    });

    let count = TOTAL_COUNT;
    AllCountries.forEach(countryName => {
        if (count === 0) {
            return;
        }

        TotalDeaths.push(allCountriesDeaths[countryName]);
        TodayDeaths_Chart.push(allCountriesTodayDeaths[countryName]);
        count--;
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
            countriesCasesForBubbleArray.push({ name: item.country, value: item.todayCases });
        }
        if (item.todayDeaths > 0) {
            countriesDeathsForBubbleArray.push({ name: item.country, value: item.todayDeaths });
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