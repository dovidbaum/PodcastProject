var fs = require('fs');

function loadData() {
    return JSON.parse(fs.readFileSync('podcasts.json'));
}

function saveData(data) {
    // make new object of what passing in
    var obj = {
        podcasts: data
    };
    //write into file
    fs.writeFileSync('podcasts.json', JSON.stringify(obj));
}


module.exports = {
    loadData: loadData,
    saveData: saveData,
}
