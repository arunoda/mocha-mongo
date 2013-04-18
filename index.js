var util            = require('util');
var mongo           = require('mongodb');
var qbox            = require('qbox');

function MochaMongo(mongoUrl) {

    if(!(this instanceof MochaMongo)) {
        return new MochaMongo(mongoUrl);
    }

    var db = null;
    var $ = qbox.create();

    mongo.MongoClient.connect(mongoUrl, function(err, _db) {

        if(err) throw err;
        db = _db;
        $.start();
    });

    this.ready = function () {

        return function(callback) {

            return function mochaCallback(done) { 
                
                $.ready(function() {
                    callback(db, done);
                });
            };
        };

    };

    this.cleanCollections = function (collectionList) {

        return function(callback) {

            return function mochaCallback(done) { 
                
                var cnt = 0;

                $.ready(function() {
                    doCleanCollections(afterCleaned);
                });

                function afterCleaned() {
                    callback(db, done);
                }

                function doCleanCollections(cb) {

                    if(cnt < collectionList.length) {
                        var collName = collectionList[cnt++];
                        db.collection(collName).remove(afterCollectionCleaned);
                    } else {
                        cb();
                    }

                    function afterCollectionCleaned(err) {

                        if(err) {
                            throw err;
                        }

                        doCleanCollections(cb);
                    }
                }
            };
        };


    };

    this.drop = function drop() {

        return function(callback) {

            return function mochaCallback(done) { 
                
                $.ready(function() {
                    db.dropDatabase(afterCleaned);
                });

                function afterCleaned(err) {

                    if(err) {
                        throw err;
                    }
                    callback(db, done);
                }
            };
        };

    };
}

module.exports = MochaMongo;