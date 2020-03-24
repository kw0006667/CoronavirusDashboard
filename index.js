const TOTAL_COUNT = 50;
const ZOOM_RATIO = 0.5;

var allCountries = [];
var prevZoomPointCode = '';
var mapData = [];
var currentSearch = '';

initialized();

function initialized() {
    let searchInput = document.getElementById('search');
    searchInput.oninput = oninputSearch;

    initializeMap();
    chart.showLoading();

    getStatsDataByNovelWebAPI()
        .then(res => {
            generateStatesDataTable(res);
        });

    getAllDataByNovelWebAPI()
        .then(data => {
            return data.json();
        })
        .then(res => {
            completeAllDataArraysForNewEndpoint(res);
            renderMap();
            showTable();
            chart.hideLoading();
        })
        .catch(error => console.error('Error: ' + error));
}

/**
 * get today and yesterday string
 * the format is 'MM-DD-YYYY'
 */
function getTodayDateString() {
    // We can only get the previous day, so, it should be yesterday
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date);
    const yesterdayYear = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(yesterday)
    const yesterdayMonth = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(yesterday)
    const yesterdayDate = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(yesterday)
    const yesterdayString = `${yesterdayMonth}-${yesterdayDate}-${yesterdayYear}`;

    let todayDate = (d => new Date(d.setDate(d.getDate() - 1)))(new Date);
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(todayDate)
    const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(todayDate)
    const date = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(todayDate)
    const dateString = `${month}-${date}-${year}`;
    return { yesterday: yesterdayString, today: dateString };
}

/**
 * generate the data for table and map 
 * @param {object} res response from fetch
 */
function completeAllDataArraysForNewEndpoint(res) {
    totalCount = res.length;

    let tableBody = document.getElementById('statusTable').getElementsByTagName('tbody')[0];

    for (let index = 0; index < res.length; index++) {
        let countryName = res[index].country;
        let totalCases = res[index].cases;
        let totalDeaths = res[index].deaths;
        let todayCases = res[index].todayCases;
        let todayDeaths = res[index].todayDeaths;
        let recovered = res[index].recovered;
        addNewRowToTable(tableBody, countryName, totalCases, totalDeaths, todayCases, todayDeaths, recovered);
        let code = isoCountries[countryName];
        if (code !== '' && code !== undefined) {
            mapData.push({
                id: code,
                name: countryName,
                code: code,
                z: totalCases > 0 ? totalCases : null, // total cases
                totalDeaths: totalDeaths,
                todayCases: todayCases,
                todayDeaths: todayDeaths,
                totalRecovered: recovered
            });
        }
    }
}

/**
 * Find country code in map by country name
 * @param {string} [countryName] - country's name
 */
function findCodeInMap(countryName) {
    let code = undefined;
    for (const item of mapData) {
        if (item.name.includes(countryName)) {
            code = item.code;
            break
        }
    }
    return code;
}

/**
 * oninput event function for search input box
 * @param {Event} event handler event
 */
function oninputSearch(event) {
    currentSearch = this.value;

    if (currentSearch !== '') {
        filterTable(currentSearch);
        let code = findCodeInMap(currentSearch);
        if (code && code != prevZoomPointCode) {
            prevZoomPointCode = code;
            chart.zoomOut();
            let point = chart.get(code);
            chart.mapZoom(0.5, point.x, point.y);
        }
    } else {
        clearTableStatus();
        chart.mapZoom();
    }
}