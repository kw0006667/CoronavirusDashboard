/**
 * convert csv text string to Javascript object
 * creditd by http://techslides.com/convert-csv-to-json-in-javascript
 * @param {string} csv the csv format string
 */
function csvToJSON(csv) {
    let lines = csv.split('\n');
    var result = [];

    var headers = lines[0].split(',');
    lines.splice(0, 1);
    lines.forEach(function(line) {
        var obj = {};
        var currentline = line.split(',');
        headers.forEach(function(header, i) {
            obj[header] = currentline[i];
        });
        result.push(obj);
    });

    return result; //JavaScript object
    // return JSON.stringify(result); //JSON
}