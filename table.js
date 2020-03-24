var EXPAND_ICON_SVG = '  <svg class="bi bi-arrows-angle-expand" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M1.5 10.036a.5.5 0 01.5.5v3.5h3.5a.5.5 0 010 1h-4a.5.5 0 01-.5-.5v-4a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M6.354 9.646a.5.5 0 010 .708l-4.5 4.5a.5.5 0 01-.708-.708l4.5-4.5a.5.5 0 01.708 0zm8.5-8.5a.5.5 0 010 .708l-4.5 4.5a.5.5 0 01-.708-.708l4.5-4.5a.5.5 0 01.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10.036 1.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v4a.5.5 0 11-1 0V2h-3.5a.5.5 0 01-.5-.5z" clip-rule="evenodd"/></svg>';

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
    let expand_icon_str = '';
    if (country == 'USA') {
        expand_icon_str = EXPAND_ICON_SVG;
        newRow.classList.add('table-row-clickable');
        newRow.onclick = showStatesDataForus;
    }
    newRow.innerHTML = '<td>' + country + expand_icon_str + '</td>' + '<td>' + totalCases + '</td>' + '<td>' + totalDeaths + '</td>' + '<td>' + todayCases + '</td>' + '<td>' + todayDeaths + '</td>' + '<td>' + totalRecovered + '</td>'; // + '<td>' + todayCases + '</td>' + '<td>' + todayDeaths + '</td>';
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

/**
 * show the modal of states of US
 * @param {Event} event click event
 */
function showStatesDataForus(event) {
    // let modalElement = document.getElementById('statesDataModal');
    // modalElement.modal('show');
    $('#statesDataModal').modal('show');
}

/**
 * generate all states data in the modal
 * @param {object[]} states the array of all states in US
 */
function generateStatesDataTable(states) {
    let tBody = document.getElementById('statesUSTable').getElementsByTagName('tbody')[0];
    states.forEach(state => {
        let newRow = tBody.insertRow(-1);
        newRow.innerHTML = '<td>' + state.state + '</td>' + '<td>' + state.cases + '</td>' + '<td>' + state.deaths + '</td>' + '<td>' + state.todayCases + '</td>' + '<td>' + state.todayDeaths + '</td>' + '<td>' + state.recovered + '</td>';
    });
}