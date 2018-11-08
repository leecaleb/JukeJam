var ObjectID = require('mongodb').ObjectID
require('dotenv').config()


var databaseName = 'JukeJam'
// Put the initial mock objects here.
var initialData = {
	'users': {
		// This user has id "1".
		'1': {
			'_id': new ObjectID('000000000000000000000001'),
			'fullName': 'q3vtjiig6bwgyicjety7m564',
			'img': 'img/girf.jpg',
			'feed': new ObjectID('000000000000000000000001'),
			'groups': [new ObjectID('000000000000000000000002'), new ObjectID('000000000000000000000001')],
			'likedPlaylist': [new ObjectID('000000000000000000000001')],
			'friends': []
		},
		'2': {
			'_id': new ObjectID('000000000000000000000002'),
			'fullName': 'Someone Else',
			'feed': new ObjectID('000000000000000000000001'),
			'groups': [],
			'likedPlaylist': [new ObjectID('000000000000000000000001'), new ObjectID('000000000000000000000002')],
			'friends': [new ObjectID('000000000000000000000004')]
		},
		'3': {
			'_id': new ObjectID('000000000000000000000003'),
			'fullName': 'Another Person',
			'img': 'img/user2.png',
			'feed': new ObjectID('000000000000000000000003'),
			'groups': [new ObjectID('000000000000000000000001')],
			'likedPlaylist': [new ObjectID('000000000000000000000002')],
			'friends': []
		},
		// This is me!
		'4': {
			'_id': new ObjectID('000000000000000000000004'),
			'fullName': 'caleb7947',
			'img': 'https://images.unsplash.com/photo-1515536765-9b2a70c4b333?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e28f973699b9805ba500348e3ecdc38a&auto=format&fit=crop&w=1576&q=80',
			'feed': new ObjectID('000000000000000000000004'),
			'groups': [new ObjectID('000000000000000000000001')],
			'likedPlaylist': [new ObjectID('000000000000000000000002')],
			'friends': [new ObjectID('000000000000000000000002')]
		}
	},
	'feeds': {
		'4': {
			'_id': new ObjectID('000000000000000000000004'),
			// Listing of FeedItems in the feed.
			'contents': [new ObjectID('000000000000000000000001'), new ObjectID('000000000000000000000002')]
		},
		'3': {
			'_id': new ObjectID('000000000000000000000003'),
			'contents': []
		},
		'2': {
			'_id': new ObjectID('000000000000000000000002'),
			'contents': []
		},
		'1': {
			'_id': new ObjectID('000000000000000000000001'),
			'contents': []
		}
	},
	'feedItems': {
		'1': {
			'_id': new ObjectID('000000000000000000000001'),
			'groupName': 'Group #3',
			'author': new ObjectID('000000000000000000000004'),
			// "img": "../public/img/girf.jpg",
			'postDate': 1453668480000,
			'location': 'Austin, TX',
			'groupUsers': [new ObjectID('000000000000000000000001'), new ObjectID('000000000000000000000003'), new ObjectID('000000000000000000000004')],
			'songs': {
				'totalSongs': 8,
				'selected_id': 3,
				'youtube': [
					{
						'index': 3,
						'_id': 'bzPQ61oYMtQ'
					}
				],
				'spotify': [
					{
						'index': 0,
						'_id': '5nNmj1cLH3r4aA4XDJ2bgY'
					},
					{
						'index': 1,
						'_id': '22UDw8rSfLbUsaAGTXQ4Z8'
					},
					{
						'index': 2,
						'_id': '1IXiBroTLzGMKvd2OTR0GG'
					},
					{
						'index': 4,
						'_id': '76EM5JFNGgkBxFq16xZTCC'
					},
					{
						'index': 5,
						'_id': '2QbSGkb3TgghEHpjKCsznm'
					},
					{
						'index': 6,
						'_id': '73OZcwiBI41R0o5TDGeZ7i'
					},
					{
						'index': 7,
						'_id': '1IMu267b5ydoJ4KmKNQQWK'
					}
				]
			},
			'likerList': [new ObjectID('000000000000000000000001'),new ObjectID('000000000000000000000002')]
		},
		'2': {
			'_id': new ObjectID('000000000000000000000002'),
			'groupName': 'Group #1',
			'author': new ObjectID('000000000000000000000002'),
			// "img": "../public/img/user2.png",
			'postDate': 1453668480000,
			'location': 'Austin, TX',
			'groupUsers': [new ObjectID('000000000000000000000001'),new ObjectID('000000000000000000000002'), new ObjectID('000000000000000000000004')],
			'songs': {
				'totalSongs': 1,
				'selected_id': 0,
				'youtube': [],
				'spotify': [
					{
						'index': 0,
						'_id': '5nNmj1cLH3r4aA4XDJ2bgY'
					}
				]
			},
			'likerList': [new ObjectID('000000000000000000000002'), new ObjectID('000000000000000000000003'), new ObjectID('000000000000000000000004')]
		}
	}
}

/**
 * Resets a collection.
 */
function resetCollection(db, name, cb) {
	// Drop / delete the entire object collection.
	db.collection(name).drop(function() {
		// Get all of the mock objects for this object collection.
		var collection = initialData[name]
		var objects = Object.keys(collection).map(function(key) {
			return collection[key]
		})
		// Insert objects into the object collection.
		db.collection(name).insertMany(objects, cb)
	})
}

/**
 * Reset the MongoDB database.
 * @param db The database connection.
 */
function resetDatabase(db, cb) {
	// The code below is a bit complex, but it basically emulates a
	// "for" loop over asynchronous operations.
	var collections = Object.keys(initialData)
	var i = 0

	// Processes the next collection in the collections array.
	// If we have finished processing all of the collections,
	// it triggers the callback.
	function processNextCollection() {
		if (i < collections.length) {
			var collection = collections[i]
			i++
			// Use myself as a callback.
			resetCollection(db, collection, processNextCollection)
		} else {
			cb()
		}
	}

	// Start processing the first collection!
	processNextCollection()
}

// Check if called directly via 'node', or required() as a module.
// http://stackoverflow.com/a/6398335
if(require.main === module) {
	// Called directly, via 'node resetdatabase.js'.
	// Connect to the database, and reset it!
	var MongoClient = require('mongodb').MongoClient
	var url = process.env.MONGO_URL
	MongoClient.connect(url, function (err, db) {
		if (err) {
			throw new Error('Could not connect to database: ' + err)
		} else {
			console.log('Resetting database...')
			resetDatabase(db, function() {
				console.log('Database reset!')
				// Close the database connection so NodeJS closes.
				db.close()
			})
		}
	})
} else {
	// require()'d.  Export the function.
	module.exports = resetDatabase
}
