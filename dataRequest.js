const GET_ALL_DATA_URL = 'https://coronavirus-tracker-api.herokuapp.com/all';
const GET_ALL_CONFIRMED_DATA_URL = "https://coronavirus-tracker-api.herokuapp.com/confirmed";
const GET_ALL_DATA_V2_URL = "https://coronavirus-tracker-api.herokuapp.com/v2/locations";
const GET_US_DATA_V2_URL = "https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=US";
const GET_ALL_DEATHS_DATA_URL = 'https://coronavirus-tracker-api.herokuapp.com/deaths';

// The format of the end should be 03-18-2020.csv (MM-DD-YYYY.csv)
const GET_ALL_DATA_CSSEGI_ENDPOINT = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/';
const GET_ALL_DATA_NOVEL_ENDPOINT = 'https://corona.lmao.ninja/countries';

function getAllData() {
    return fetch(GET_ALL_DATA_URL);
}

function getAllDeathsData() {
    return fetch(GET_ALL_DEATHS_DATA_URL);
}

function getAllDataV2() {
    return fetch(GET_ALL_DATA_V2_URL);
}

function getUSDataV2() {
    return fetch(GET_US_DATA_V2_URL);
}

function getAllDataByNovelWebAPI() {
    return fetch(GET_ALL_DATA_NOVEL_ENDPOINT);
}

function getAllDataCSSEGI(yesterday, today) {
    return fetch(GET_ALL_DATA_CSSEGI_ENDPOINT + today + '.csv')
        .then(data => {
            if (data.ok) {
                return data.text();
            } else {
                fetch(GET_ALL_DATA_CSSEGI_ENDPOINT + yesterday + '.csv')
                    .then(data => {
                        return data.text();
                    })
            }
        });
}


function getCountryConfirmed(countryName) {
    if (!cases_data_cache || countryName === '') {
        return null;
    }

    let countryConfirmed = [];
    cases_data_cache.locations.forEach(location => {
        if (location.country.includes(countryName) || location.country_code.includes(countryName) || location.province.includes(countryName)) {
            if (!location.province.includes(',')) {
                countryConfirmed.push(location);
            }
        }
    });

    return countryConfirmed;
}