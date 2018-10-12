// Data goes here.
var initialData = {
	'users': {
		// This user has id "1".
		'1': {
			'_id': 1,
			'fullName': 'Someone',
			'img': 'img/girf.jpg',
			'feed': 1,
			'groups': [2],
			'likedPlaylist':[1]
		},
		'2': {
			'_id': 2,
			'fullName': 'Someone Else',
			'feed': 2,
			'groups': [],
			'likedPlaylist':[1,2]
		},
		'3': {
			'_id': 3,
			'fullName': 'Another Person',
			'img': 'img/user2.png',
			'feed': 3,
			'groups': [],
			'likedPlaylist':[2]
		},
		// This is me!
		'4': {
			'_id': 4,
			'fullName': 'caleb7947',
			// ID of your feed.
			'feed': 4,
			'groups': [1],
			'likedPlaylist':[2]
		}
	},
	'feeds': {
		'4': {
			'_id': 4,
			// Listing of FeedItems in the feed.
			'contents': [1]
		},
		'3': {
			'_id': 3,
			'contents': []
		},
		'2': {
			'_id': 2,
			'contents': []
		},
		'1': {
			'_id': 1,
			'contents': []
		}
	},
	'feedItems': {
		'1': {
			'_id': 1,
			'groupName': 'Group #3',
			'author': 4,
			// "img": "../public/img/girf.jpg",
			'postDate': 1453668480000,
			'location': 'Austin, TX',
			'groupUsers': [1, 3, 4],
			// "songs": [
			//   "5nNmj1cLH3r4aA4XDJ2bgY",
			//   "41on8RwRh22IHcChAN2gm8",
			//   "1IXiBroTLzGMKvd2OTR0GG",
			//   "76EM5JFNGgkBxFq16xZTCC",
			//   "2QbSGkb3TgghEHpjKCsznm",
			//   "73OZcwiBI41R0o5TDGeZ7i",
			//   "1IMu267b5ydoJ4KmKNQQWK"],
			'songs': {
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
						'_id': '41on8RwRh22IHcChAN2gm8'
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
			'likerList': [1,2]
		},
		'2': {
			'_id': 2,
			'groupName': 'Group #1',
			'author': 2,
			// "img": "../public/img/user2.png",
			'postDate': 1453668480000,
			'location': 'Austin, TX',
			'groupUsers': [1,2],
			'songs': [
				{
					'type': 'spotify',
					'_id': '5nNmj1cLH3r4aA4XDJ2bgY'
				}
			],
			'likerList': [2, 3, 4]
		}
	}
}

var data
// If 'true', the in-memory object representing the database has changed,
// and we should flush it to disk.
var updated = false
// Pull in Node's file system and path modules.
var fs = require('fs'),
	path = require('path')

try {
	// ./database.json may be missing. The comment below prevents ESLint from
	// complaining about it.
	// Read more about configuration comments at the following URL:
	// http://eslint.org/docs/user-guide/configuring#configuring-rules
	/* eslint "node/no-missing-require": "off" */
	data = require('./database.json')
} catch (e) {
	// ./database.json is missing. Use the seed data defined above
	data = JSONClone(initialData)
}

/**
 * A dumb cloning routing. Serializes a JSON object as a string, then
 * deserializes it.
 */
function JSONClone(obj) {
	return JSON.parse(JSON.stringify(obj))
}

function dataCollection(collection) {
	var collectionObj = data[collection]
	if (!collectionObj) {
		throw new Error(`Object collection ${collection} does not exist in the database!`)
	}
	console.log('JSONClone(collection): ' + JSONClone(data[collection]))
	return JSONClone(data[collection])
}
module.exports.dataCollection = dataCollection

/**
 * Emulates reading a "document" from a NoSQL database.
 * Doesn't do any tricky document joins, as we will cover that in the latter
 * half of the course. :)
 */
function readDocument(collection, id) {
	// Clone the data. We do this to model a database, where you receive a
	// *copy* of an object and not the object itself.
	var collectionObj = data[collection]
	if (!collectionObj) {
		throw new Error(`Object collection ${collection} does not exist in the database!`)
	}
	var obj = collectionObj[id]
	if (obj === undefined) {
		throw new Error(`Object ${id} does not exist in object collection ${collection} in the database!`)
	}
	return JSONClone(data[collection][id])
}
module.exports.readDocument = readDocument

/**
 * Emulates writing a "document" to a NoSQL database.
 */
function writeDocument(collection, changedDocument) {
	var id = changedDocument._id
	if (id === undefined) {
		throw new Error('You cannot write a document to the database without an _id! Use AddDocument if this is a new object.')
	}
	// Store a copy of the object into the database. Models a database's behavior.
	data[collection][id] = JSONClone(changedDocument)
	// Update our 'database'.
	updated = true
}
module.exports.writeDocument = writeDocument

/**
 * Adds a new document to the NoSQL database.
 */
function addDocument(collectionName, newDoc) {
	var collection = data[collectionName]
	var nextId = Object.keys(collection).length
	if (newDoc.hasOwnProperty('_id')) {
		throw new Error('You cannot add a document that already has an _id. addDocument is for new documents that do not have an ID yet.')
	}
	while (collection[nextId]) {
		nextId++
	}
	newDoc._id = nextId
	writeDocument(collectionName, newDoc)
	return newDoc
}
module.exports.addDocument = addDocument

/**
 * Deletes a document from an object collection.
 */
function deleteDocument(collectionName, id) {
	var collection = data[collectionName]
	if (!collection[id]) {
		throw new Error(`Collection ${collectionName} lacks an item with id ${id}!`)
	}
	delete collection[id]
	updated = true
}
module.exports.deleteDocument = deleteDocument

/**
 * Returns an entire object collection.
 */
function getCollection(collectionName) {
	return JSONClone(data[collectionName])
}
module.exports.getCollection = getCollection

/**
 * Reset the database.
 */
function resetDatabase() {
	data = JSONClone(initialData)
	updated = true
}
module.exports.resetDatabase = resetDatabase

// Periodically updates the database on the hard drive
// when changed.
setInterval(function() {
	if (updated) {
		fs.writeFileSync(path.join(__dirname, 'database.json'), JSON.stringify(data), { encoding: 'utf8' })
		updated = false
	}
}, 200)
