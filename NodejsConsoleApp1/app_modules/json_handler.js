var getJSONHttp = function (url, callback) {
    var request = require("request");
    
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        console.log("Received answer!");
        if (/*error === false && || response.statusCode === 429*/ response.statusCode === 200) {
            callback(body);

        } else {
            console.log("Got error: " + error + "     url: " + url);
            console.log("Status:" + response.statusCode);
        }
    });
};


function get(url) {

    return new (require('httpclient').HttpClient)({
        method: 'GET',
        url: url
    }).finish().body.read().decodeToString();

}


exports.getJSONHttp = getJSONHttp;
exports.get = get;