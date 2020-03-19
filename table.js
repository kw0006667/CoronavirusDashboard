function addNewRowToTable(tableBody, country, totalCases, totalDeaths, todayCases, todayDeaths, totalRecovered) {
    let newRow = tableBody.insertRow(-1);
    newRow.innerHTML = '<td>' + country + '</td>' + '<td>' + totalCases + '</td>' + '<td>' + totalDeaths + '</td>' + '<td>' + totalRecovered + '</td>'; // + '<td>' + todayCases + '</td>' + '<td>' + todayDeaths + '</td>';
}

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

function showTable() {
    let statusTable = document.getElementById('statusTable');
    statusTable.style.display = '';
}