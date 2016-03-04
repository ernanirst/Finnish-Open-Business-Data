var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://backend2:abc123@ds055885.mongolab.com:55885/hacksummit';

/*****************Insert JSON to DB*******************/
var insertConfig = function (config) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        insertDocument(db, config, function () {
            db.close();
        });
    });
};


var insertDocument = function (db, config, callback) {
    db.collection('configs').insertOne(config, function (err, result) {
        assert.equal(err, null);
        console.log("Inserted a document!!!");
        callback();
    });
};

module.exports.insertConfig = insertConfig;