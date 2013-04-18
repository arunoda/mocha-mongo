var assert  = require('assert');

var db = require('../')('mongodb://localhost');
var ready = db.ready();
var cleanC = db.cleanCollections(['coll1', 'coll2']);
var drop = db.drop();

suite('MochaMongo', function() {

    suite('.ready()', function() {

        test('use db in tests directly', ready(function(db, done) {

            assert.ok(db);
            done();
        }));
    });

    suite('.cleanCollections()', function() {

        test('add some data to the collections', ready(function(db, done) {

            db.collection('coll1').insert({type: 'a'}, function(err) {

                assert.ifError(err);
                db.collection('coll2').insert({type: 'b'}, afterInserted);
            });

            function afterInserted(err) {

                assert.ifError(err);
                done();
            }
        }));

        test('clean collection', cleanC(function(db, done) {

            db.collection('coll1').find().count(function(err, cnt) {

                assert.ifError(err);
                assert.equal(cnt, 0);
                db.collection('coll2').find().count(afterCountFound);
            });

            function afterCountFound(err, cnt) {

                assert.ifError(err);
                assert.equal(cnt, 0);
                done();
            }
        }));
    });

    suite('.drop()', function() {

        test('add some data to the collections', ready(function(db, done) {

            db.collection('coll1').insert({type: 'a'}, function(err) {

                assert.ifError(err);
                db.collection('coll2').insert({type: 'b'}, afterInserted);
            });

            function afterInserted(err) {

                assert.ifError(err);
                done();
            }
        }));

        test('clean db', drop(function(db, done) {

            db.collection('coll1').find().count(function(err, cnt) {

                assert.ifError(err);
                assert.equal(cnt, 0);
                db.collection('coll2').find().count(afterCountFound);
            });

            function afterCountFound(err, cnt) {

                assert.ifError(err);
                assert.equal(cnt, 0);
                done();
            }
        }));
    });
});