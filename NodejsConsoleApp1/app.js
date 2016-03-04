var json_handler = require('./app_modules/json_handler.js');

var baseUrl = "http://avoindata.prh.fi/bis/v1?totalResults=false&maxResults=1000&resultsFrom=0";
var param1 = '&businessLineCode=';
var param2 = '&streetAddressPostCode=';

var param1values = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 55, 56, 90, 91, 92, 93];

var param2values = ["12130", "12170", "12450", "13100", "13101", "13102", "13105", "13110", "13111", "13130", "13131", "13135", "13200", "13210", "13211", "13215", "13220", "13250", "13270", "13300", "13330", "13430", "13500", "13501", "13505", "13530", "13600", "13700", "13720", "13725", "13800", "13900", "14240", "14300", "14330", "14370", "14430", "14450", "14500", "14530", "14680", "14690", "14700", "14770", "14810", "14820", "14840", "14870", "14930", "14960", "14980", "16800", "16900", "16901", "16905", "16960", "16970", "16980", "17610", "31250", "31700", "36120", "36660", "37800", "11100", "11101", "11105", "11111", "11120", "11125", "11130", "11135", "11310", "11311", "11710", "11715", "11910", "12310", "30100", "30101", "30102", "30105", "30107", "30108", "30300", "30420", "30421", "31110", "31130", "31140", "31170", "31300", "32210", "13701", "13721", "13880", "14610", "14620", "37740", "12380", "12400", "12401", "12540", "14140", "14200", "14201", "14205", "12750", "12950", "31230", "31310", "31340", "31350", "31370", "31380", "31410", "31600", "31610", "32100", "32140", "32200", "03600", "03790", "05720", "05800", "12520", "12600", "12630", "12640", "12700", "12701", "12820", "12920", "31601", "31620", "31630", "31640", "31160", "31641", "31650", "31950", "32270", "32280", "04740", "05100", "05820", "05950", "12100", "12101", "12210", "12240", "12350"];



var listOfUrls = [];

//list of urls
var getUrls = [];
var cont = 0;
var cont2 = 0;

//create and get the urls
var getJSONHttp = function (callback) {
    console.log("GET " + getUrls[cont]);
    var request = require("request");
    request({
        url: getUrls[cont],
        json: true
    }, function (error, response, body) {
        
        //sleep
        /*ts = Math.floor(Date.now());
        for (var k = ts; k < (ts + 3000);) {
            k = Math.floor(Date.now());
        }*/
        //if (getUrls[cont] == null)
        //    console.log("ERROR: " + getUrls[cont]);


        if (response.statusCode === 200 || response.statusCode === 404) {
            callback(body);
            if (cont < getUrls.length) {
                getJSONHttp(test);
            }
        } else {
            console.log("Got error: " + error + "     url: " + url);
            console.log("Status:" + response.statusCode);
            //console.log("Body: " + JSON.stringify(response));
        }
        
        cont++;
        
    });
};

//get from detailsUrls
var getFromDetailUrl = function (callback) {
    console.log("GET " + listOfUrls[cont2]);
    var request = require("request");
    request({
        url: listOfUrls[cont2],
        json: true
    }, function (error, response, body) {
        
        //sleep
        /*ts = Math.floor(Date.now());
        for (var k = ts; k < (ts + 3000);) {
            k = Math.floor(Date.now());
        }*/

        if (response.statusCode === 200) {
            callback(body);
            if (cont2 < listOfUrls.length) {
                getFromDetailUrl(test2);
            }
        } else {
            console.log("Got error: " + error + "     url: " + url);
            console.log("Status:" + response.statusCode);
            //console.log("Body: " + JSON.stringify(response));
        }
        cont2++;
    });
};

var bussinessArray = [];

var appendToLog = function (data) {
    var fs = require('fs');
    var logStream = fs.createWriteStream('log.csv', { 'flags': 'a' });
    logStream.end(JSON.stringify(data) + " \r\n");
}


var getContact = function (type, arr){
    for(var i = 0; i < arr.length ;i++){
        if (arr[i].type == type)
            return arr[i].value
    }
    return false;
}

var test2 = function (json) {

    /*var bus = {};
    bus.businessId = json.results[0].businessId;
    bus.name = json.results[0].name;
    bus.street = json.results[0].addresses[0].street;
    bus.postCode = json.results[0].addresses[0].postCode;
    */
    var arr = [
        json.results[0].businessId,
        json.results[0].name,
        json.results[0].businessLines[0].name,
        json.results[0].addresses[0].street,
        json.results[0].addresses[0].postCode,
        json.results[0].addresses[0].city,
        json.results[0].addresses[1].street,
        json.results[0].addresses[1].postCode,
        json.results[0].addresses[1].city,
    ];


    var contactDetails = json.results[0].contactDetails;

    var phone = getContact("Puhelin", contactDetails);
    if (phone != false) {
        arr.push("Puhelin");
        arr.push(phone);
    }
    var mobile = getContact("Matkapuhelin", contactDetails);
    if (mobile != false) {
        arr.push("Matkapuhelin");
        arr.push(mobile);
    }
    var site = getContact("Kotisivun www-osoite", contactDetails);
    if (site != false) {
        arr.push("Kotisivun www-osoite");
        arr.push(site);
    }
    
    appendToLog(
            (arr)                         //.replace("[","").replace("]","").replace('\"',"")
    );
    //console.log(json.results[0].businessLines[0].name);
    
    //bussinessArray.push(bus);

    if (cont2 >= listOfUrls.length) {
        console.log("finish..");
    }
}


var test = function (json){
    var arr = json.results;

    for(var i = 0; i < arr.length ; i++){
        //console.log('bnumb ' + i + ': ' + arr[i]['detailsUri']);
        if ((listOfUrls.indexOf(arr[i]['detailsUri']) == -1) && 
                arr[i]['detailsUri'] != null &&
                arr[i]['detailsUri'] != undefined &&
                arr[i]['detailsUri'] != "" &&
                arr[i]['detailsUri'] != " "
            ) {
            listOfUrls.push(arr[i]['detailsUri']);
        }
        
    }
    if (cont >= getUrls.length) {
        console.log("list: " + JSON.stringify(listOfUrls));
        console.log("\n\n*******************DETAIL INFO*******************\n");
        getFromDetailUrl(test2);
    }
}

var url = '';
var ts = 0;
for (var i = 0; i < param2values.length; i++) {
    //console.log('Postal code ' + i);
    for (var k = 0; k < param1values.length; k++) {

        url = baseUrl + param1 + param1values[k] + param2 + param2values[i];
        getUrls.push(url);
        if (i == param2values.length-1 && k == param1values.length-1) {
            //console.log(getUrls.length);
            getJSONHttp(test);
        }
    }
}
