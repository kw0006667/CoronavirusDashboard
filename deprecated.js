function generateAllCountriesConfirmed() {
    let temp = [];
    cases_data_cache.locations.forEach(location => {
        if (location.country.includes('Taipei') || location.country.includes('Hong Kong') || location.country.includes('Mainland')) {

        } else {
            if (temp[location.country]) {
                temp[location.country] += location.latest;
            } else {
                temp[location.country] = location.latest;
            }
        }
    });

    for (const key in temp) {
        if (temp.hasOwnProperty(key)) {
            allCountriesConfirmed.push({
                name: key,
                confirmed: temp[key]
            });
        }
    }

    allCountriesConfirmed.sort((a, b) => b.confirmed - a.confirmed);

    allCountriesConfirmed.forEach(country => {
        if (country.confirmed > 0) {
            if (country.name.includes('Taiwan')) {
                AllCountries.push('Taiwan');
            } else {
                AllCountries.push(country.name);
            }
            TotalCases.push(country.confirmed);
        }
    })
}