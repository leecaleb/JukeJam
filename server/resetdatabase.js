var ObjectID = require('mongodb').ObjectID
require('dotenv').config()


var databaseName = 'JukeJam'
// Put the initial mock objects here.
var initialData = {
	'users': {
		// This user has id "1".
		'1': {
			'_id': new ObjectID('5bee4e5a3f7e8333c9496164'),
			'fullName': 'Mark',
			'img': 'img/girf.jpg',
			'feed': new ObjectID('5bee4e5a3f7e8333c9496164'),
			'groups': [new ObjectID('5bee4e7bc3c45933fb98de42'), new ObjectID('5bee4e5a3f7e8333c9496164')],
			'likedPlaylist': [new ObjectID('5bee4e5a3f7e8333c9496164')],
			'friends': []
		},
		'2': {
			'_id': new ObjectID('5bee4e7bc3c45933fb98de42'),
			'fullName': 'Sarah',
			'feed': new ObjectID('5bee4e7bc3c45933fb98de42'),
			'groups': [],
			'likedPlaylist': [new ObjectID('5bee4e5a3f7e8333c9496164'), new ObjectID('5bee4e7bc3c45933fb98de42')],
			'friends': [new ObjectID('5bee4e04f9a4a9332eddeb63')]
		},
		'3': {
			'_id': new ObjectID('5bee4e93eacfb53434edbc3a'),
			'fullName': 'Mike',
			'img': 'img/user2.png',
			'feed': new ObjectID('5bee4e93eacfb53434edbc3a'),
			'groups': [new ObjectID('5bee4e5a3f7e8333c9496164')],
			'likedPlaylist': [new ObjectID('5bee4e7bc3c45933fb98de42')],
			'friends': []
		},
		// This is me!
		'4': {
			'_id': new ObjectID('5bee4e04f9a4a9332eddeb63'),
			'fullName': 'caleb7947',
			'img': 'https://images.unsplash.com/photo-1515536765-9b2a70c4b333?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e28f973699b9805ba500348e3ecdc38a&auto=format&fit=crop&w=1576&q=80',
			'feed': new ObjectID('5bee4e04f9a4a9332eddeb63'),
			'groups': [new ObjectID('5bee4e5a3f7e8333c9496164')],
			'likedPlaylist': [new ObjectID('5bee4e7bc3c45933fb98de42')],
			'friends': [new ObjectID('5bee4e7bc3c45933fb98de42'), new ObjectID('5bee4e93eacfb53434edbc3a'), new ObjectID('5bee4e5a3f7e8333c9496164')]
		}
	},
	'feeds': {
		'4': {
			'_id': new ObjectID('5bee4e04f9a4a9332eddeb63'),
			// Listing of FeedItems in the feed.
			'contents': [new ObjectID('5bee4e7bc3c45933fb98de42'), new ObjectID('5bee4e5a3f7e8333c9496164')]
		},
		'3': {
			'_id': new ObjectID('5bee4e93eacfb53434edbc3a'),
			'contents': []
		},
		'2': {
			'_id': new ObjectID('5bee4e7bc3c45933fb98de42'),
			'contents': []
		},
		'1': {
			'_id': new ObjectID('5bee4e5a3f7e8333c9496164'),
			'contents': []
		}
	},
	'feedItems': {
		'1': {
			'_id': new ObjectID('5bee4e5a3f7e8333c9496164'),
			'groupName': '16:00sundays',
			'author': new ObjectID('5bee4e04f9a4a9332eddeb63'),
			'thumbnail': 'https://i.scdn.co/image/4e84f240e82a8fa127a66c29f323d3032d049066',
			'postDate': 1453668480000,
			'location': 'Austin, TX',
			'groupUsers': [new ObjectID('5bee4e5a3f7e8333c9496164'), new ObjectID('5bee4e93eacfb53434edbc3a'), new ObjectID('5bee4e04f9a4a9332eddeb63')],
			'songs': {
				'totalSongs': 12,
				'selected_id': 0,
				'youtube': [
					{
						"index": 1,
						"_id": "aj_b7S0UweM"
					},
					{
						"index": 3,
						"_id": "HMZvrdZ86M8"
					},
					{
						"index": 4,
						"_id": "TBeFmekd8ME"
					},
					{
						"index": 6,
						"_id": "6HJIXDOJRyg"
					},
					{
						"index": 9,
						"_id": "t4cjHg1pX2s"
					}
					
				],
				'spotify': [
					{
						"index": 0,
						"_id": "5NPOzGF9KwzjgfA3q6zbCf"
					},
					{
						"index": 2,
						"_id": "5RelKA9tWt5hbkFNAqZtLB"
					},
					{
						"index": 5,
						"_id": "393qU26zNVIQNzdBxWQPek"
					},
					{
						"index": 7,
						"_id": "4id34GLER7bKgP0N3eroSQ"
					},
					{
						"index": 8,
						"_id": "53Q8YAh03JoqrGQ5U9bZNx"
					},
					{
						"index": 10,
						"_id": "1Oui96x92JVAzK4nsoKavW"
					},
					{
						"index": 11,
						"_id": "4ktkHx7JtPUk2D6ma7tUQ7"
					}
				]
			},
			'likerList': [new ObjectID('5bee4e5a3f7e8333c9496164'),new ObjectID('5bee4e7bc3c45933fb98de42')]
		},
		'2': {
			'_id': new ObjectID('5bee4e7bc3c45933fb98de42'),
			'groupName': 'Group #1',
			'author': new ObjectID('5bee4e7bc3c45933fb98de42'),
			// "img": "../public/img/user2.png",
			'postDate': 1453668480000,
			'location': 'Austin, TX',
			'thumbnail': 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=beb0f979ed2a7da134fb95a2ae6290c3&auto=format&fit=crop&w=1500&q=80',
			'groupUsers': [new ObjectID('5bee4e5a3f7e8333c9496164'),new ObjectID('5bee4e7bc3c45933fb98de42'), new ObjectID('5bee4e04f9a4a9332eddeb63')],
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
			'likerList': [new ObjectID('5bee4e7bc3c45933fb98de42'), new ObjectID('5bee4e93eacfb53434edbc3a'), new ObjectID('5bee4e04f9a4a9332eddeb63')]
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
