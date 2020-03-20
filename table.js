/**
 * add a new rwo to the table which shows the data
 * @param {DOMElement} tableBody table which shows the data
 * @param {string} country country name
 * @param {number} totalCases total confirmed cases
 * @param {number} totalDeaths total deaths
 * @param {number} todayCases today's new confirmed cases
 * @param {number} todayDeaths today's new deaths
 * @param {number} totalRecovered total recovered cases
 */
function addNewRowToTable(tableBody, country, totalCases, totalDeaths, todayCases, todayDeaths, totalRecovered) {
    let newRow = tableBody.insertRow(-1);
    newRow.innerHTML = '<td>' + country + '</td>' + '<td>' + totalCases + '</td>' + '<td>' + totalDeaths + '</td>' + '<td>' + todayCases + '</td>' + '<td>' + todayDeaths + '</td>' + '<td>' + totalRecovered + '</td>'; // + '<td>' + todayCases + '</td>' + '<td>' + todayDeaths + '</td>';
}

/**
 * change the display of rows of the table from none to empty
 */
function clearTableStatus() {
    let tableBody = document.getElementById('statusTable').getElementsByTagName('tbody')[0];
    let trs = tableBody.getElementsByTagName('tr')
    for (const trIndex in trs) {
        if (trs.hasOwnProperty(trIndex)) {
            let tr = trs[trIndex]
            let countryName = tr.getElementsByTagName('td')[0].innerText;
            tr.style.display = '';
        }
    }
}

/**
 * filter out the rows and set other rows as display:none
 * @param {string} searchText the search text for country name
 */
function filterTable(searchText) {
    let tableBody = document.getElementById('statusTable').getElementsByTagName('tbody')[0];
    let trs = tableBody.getElementsByTagName('tr')
    for (const trIndex in trs) {
        if (trs.hasOwnProperty(trIndex)) {
            let tr = trs[trIndex]
            let countryName = tr.getElementsByTagName('td')[0].innerText;
            if (countryName.includes(searchText)) {
                tr.style.display = '';
            } else {
                tr.style.display = 'none';
            }
        }
    }
}

/**
 * set the table display
 */
function showTable() {
    let statusTable = document.getElementById('statusTable');
    statusTable.style.display = '';
}