var myHeaders = new Headers();
myHeaders.append("User-Agent", "PostmanRuntime/7.23.0");
myHeaders.append("Accept", "*/*");
myHeaders.append("Cache-Control", "no-cache");
myHeaders.append("Postman-Token", "2759f518-3ed2-4423-bfcf-b65edf5bb767");
myHeaders.append("Host", "corona.lmao.ninja");
myHeaders.append("Accept-Encoding", "gzip, deflate, br");
myHeaders.append("Cookie", "__cfduid=ddb9c92c95f344461d33230ee269e45081583897148");
myHeaders.append("Connection", "keep-alive");

const myInit = {
    method: 'GET',
    headers: {
        // 'Access-Control-Allow-Origin': '*',
        // 'Accept': 'application/json',
        // 'Content-Type': 'application/json',
    },
    mode: 'no-cors',
    referrer: "", // or "" to send no Referer header,
    // or an url from the current origin
    referrerPolicy: "no-referrer-when-downgrade", // no-referrer, origin, same-origin...
};

var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

const data_struct = {
    confirm: {
        last_updated: '',
        latest: '',
        locations: [{
                coordinates: {
                    lat: '',
                    long: ''
                },
                country: '',
                country_code: '',
                history: {

                },
                latest: '',
                province: ''
            },

        ]
    },
    deaths: '',
    latest: '',
    recovered: ''
}

const GET_ALL_DATA_URL = 'https://coronavirus-tracker-api.herokuapp.com/all';
const GET_ALL_CONFIRMED_DATA_URL = "https://coronavirus-tracker-api.herokuapp.com/confirmed";
const GET_ALL_DATA_V2_URL = "https://coronavirus-tracker-api.herokuapp.com/v2/locations";
const GET_US_DATA_V2_URL = "https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=US";
const GET_ALL_DEATHS_DATA_URL = 'https://coronavirus-tracker-api.herokuapp.com/deaths';

// The format of the end should be 03-18-2020.csv (MM-DD-YYYY.csv)
const GET_ALL_DATA_CSSEGI_ENDPOINT = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/';

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