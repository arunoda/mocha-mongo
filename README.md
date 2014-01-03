mocha-mongo [![Build Status](https://travis-ci.org/arunoda/mocha-mongo.png?branch=master)](https://travis-ci.org/arunoda/mocha-mongo)
===========

Set of mongodb testing helpers for mocha

> mocha's TDD testing style used here and only the test function is used 

### Initialization

~~~js
var mongo = require('mocha-mongo')('mongodb://localhost');
~~~

### Using the db in tests

~~~js
var ready = mongo.ready(); //only need to create this once

test('using the db', ready(function(db, done) {
	
	db.collection('test').insert({hello: 'world'}, done);
}));
~~~

### Use fresh collections without data

We need to ensure collections are cleaned before running the test.

~~~js
var clean = mongo.cleanCollections(['coll1', 'coll2']); //only need to create this once

test('test using cleaned collections', clean(function(db, done) {
	
	db.collection('coll1').find().count(function(err, count) {

		assert.equal(count, 0);
		done();
	});
}));
~~~

### Drop the whole db

~~~js
var drop = mongo.drop(); //only need to create this once

test('test using a fresh db', drop(function(db, done) {
	
	db.collection('coll1').find().count(function(err, count) {

		assert.equal(count, 0);
		done();
	});
}));
~~~
