var mongoose = require('mongoose'),
	elastical = require('elastical'),
	esClient = new(require('elastical').Client)(),
	should = require('should'),
	config = require('./config'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	async = require('async'),
	mongoosastic = require('../lib/mongoosastic');

var BookSchema = new Schema({
	title: String
});
BookSchema.plugin(mongoosastic, {
	bulk: {
		size: 10,
		delay: 100
	}
});

var Book = mongoose.model('Book2', BookSchema);

describe('Bulk mode', function() {
	var books = null;

	before(function(done) {
		config.deleteIndexIfExists(['book2s'], function() {
			mongoose.connect(config.mongoUrl, function() {
				var client = mongoose.connections[0].db;
				client.collection('book2s', function(err, _books) {
					books = _books;
					Book.remove(done);
				});
			});
		});
	});
	before(function(done) {
		async.forEach(bookTitles(), function(title, cb) {
			new Book({
				title: title
			}).save(cb);
		}, function() {
			setTimeout(done, 1200);
		});
	});
	before(function(done) {
			Book.findOne({
				title: 'American Gods'
			}, function(err, book) {
				book.remove(function() {
					setTimeout(done, 1200);
				});
			});
		});
	it('should index all objects and support deletions too', function(done) {
		Book.search({}, function(err, results) {
			results.should.have.property('hits').with.property('total', 52);
			done();
		});
	});
});

function bookTitles() {
	var books = [
		'American Gods',
		'Gods of the Old World',
		'American Gothic'
	];
	for (var i = 0; i < 50; i++) {
		books.push('ABABABA' + i);
	}
	return books;
}