import React from 'react';
import ReactDOM from 'react-dom';

// Modify with your startup's name!
var startupName = "QueueApp";

// Put your mock objects here, as in Workshop 4
var initialData = {
  "users": {
    // This user has id "1".
    "80srock": {
      "_id": '80srock',
      "fullName": "Someone",
      "img": "img/girf.jpg",
      "feed": '80srock',
      "groups": [2],
      "likedPlaylist":[1]
    },
    "zombie": {
      "_id": 'zombie',
      "fullName": "Someone Else",
      "feed": 'zombie',
      "groups": [],
      "likedPlaylist":[1,2]
    },
    "thecranberries": {
      "_id": 'thecranberries',
      "fullName": "Another Person",
      "img": "img/user2.png",
      "feed": 'thecranberries',
      "groups": [],
      "likedPlaylist":[2]
    },
    // This is me!
    "caleb7947": {
      "_id": "caleb7947",
      "fullName": "Phoebe Buffay",
      // ID of your feed.
      "feed": "caleb7947",
      "groups": [1],
      "likedPlaylist":[2]
    }
  },
  "feeds": {
    "caleb7947": {
      "_id": 4,
      // Listing of FeedItems in the feed.
      "contents": [1]
    },
    "thecranberries": {
      "_id": 3,
      "contents": []
    },
    "zombie": {
      "_id": 2,
      "contents": []
    },
    "80srock": {
      "_id": 1,
      "contents": []
    }
  },
  "feedItems": {
    "1": {
      "_id": 1,
      "groupName": "Group #3",
      "author": "caleb7947",
      // "img": "../public/img/girf.jpg",
      "postDate": 1453668480000,
      "location": "Austin, TX",
      "groupUsers": ['80srock', 'thecranberries', "caleb7947"],
      // "songs": [
      //   "5nNmj1cLH3r4aA4XDJ2bgY",
      //   "41on8RwRh22IHcChAN2gm8",
      //   "1IXiBroTLzGMKvd2OTR0GG",
      //   "76EM5JFNGgkBxFq16xZTCC",
      //   "2QbSGkb3TgghEHpjKCsznm",
      //   "73OZcwiBI41R0o5TDGeZ7i",
      //   "1IMu267b5ydoJ4KmKNQQWK"],
      "songs": {
        "youtube": [
          {
            "index": 3,
            "_id": "bzPQ61oYMtQ"
          }
        ],
        "spotify": [
          {
            "index": 0,
            "_id": "5nNmj1cLH3r4aA4XDJ2bgY"
          },
          {
            "index": 1,
            "_id": "41on8RwRh22IHcChAN2gm8"
          },
          {
            "index": 2,
            "_id": "1IXiBroTLzGMKvd2OTR0GG"
          },
          {
            "index": 4,
            "_id": "76EM5JFNGgkBxFq16xZTCC"
          },
          {
            "index": 5,
            "_id": "2QbSGkb3TgghEHpjKCsznm"
          },
          {
            "index": 6,
            "_id": "73OZcwiBI41R0o5TDGeZ7i"
          },
          {
            "index": 7,
            "_id": "1IMu267b5ydoJ4KmKNQQWK"
          }
        ]
      },
      "likerList": ['80srock','zombie']
    },
    "2": {
      "_id": 2,
      "groupName": "Group #1",
      "author": 'zombie',
      // "img": "../public/img/user2.png",
      "postDate": 1453668480000,
      "location": "Austin, TX",
      "groupUsers": ['80srock','zombie'],
      "songs": [
        {
          "type": "spotify",
          "_id": "5nNmj1cLH3r4aA4XDJ2bgY"
        }
      ],
      "likerList": ['zombie', 'thecranberries', "caleb7947"]
    }
  }
};

var data = JSON.parse(localStorage.getItem(startupName));
if (data === null) {
  data = JSONClone(initialData);
}

/**
 * A dumb cloning routing. Serializes a JSON object as a string, then
 * deserializes it.
 */
function JSONClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Emulates reading a "document" from a NoSQL database.
 * Doesn't do any tricky document joins, as we will cover that in the latter
 * half of the course. :)
 */
export function readDocument(collection, id) {
  // Clone the data. We do this to model a database, where you receive a
  // *copy* of an object and not the object itself.
  var collectionObj = data[collection];
  if (!collectionObj) {
    throw new Error(`Object collection ${collection} does not exist in the database!`);
  }
  var obj = collectionObj[id];
  if (obj === undefined) {
    throw new Error(`Object ${id} does not exist in object collection ${collection} in the database!`);
  }
  return JSONClone(data[collection][id]);
}

/**
 * Emulates writing a "document" to a NoSQL database.
 */
export function writeDocument(collection, changedDocument) {
  var id = changedDocument._id;
  if (id === undefined) {
    throw new Error(`You cannot write a document to the database without an _id! Use AddDocument if this is a new object.`);
  }
  // Store a copy of the object into the database. Models a database's behavior.
  data[collection][id] = JSONClone(changedDocument);
  // Update our 'database'.
  localStorage.setItem('facebook_data', JSON.stringify(data));
}

/**
 * Adds a new document to the NoSQL database.
 */
export function addDocument(collectionName, newDoc) {
  var collection = data[collectionName];
  var nextId = Object.keys(collection).length;
  if (newDoc.hasOwnProperty('_id')) {
    throw new Error(`You cannot add a document that already has an _id. addDocument is for new documents that do not have an ID yet.`);
  }
  while (collection[nextId]) {
    nextId++;
  }
  newDoc._id = nextId;
  writeDocument(collectionName, newDoc);
  return newDoc;
}

/**
 * Deletes a document from an object collection.
 */
export function deleteDocument(collectionName, id) {
  var collection = data[collectionName];
  if (!collection[id]) {
    throw new Error(`Collection ${collectionName} lacks an item with id ${id}!`);
  }
  delete collection[id];
  // Update our 'database'.
  localStorage.setItem('facebook_data', JSON.stringify(data));
}

/**
 * Reset our browser-local database.
 */
export function resetDatabase() {
  localStorage.setItem('facebook_data', JSON.stringify(initialData));
  data = JSONClone(initialData);
}

/**
 * Returns an entire object collection.
 */
export function getCollection(collectionName) {
  return JSONClone(data[collectionName]);
}

/**
 * Reset database button.
 */
export class ResetDatabase extends React.Component {
  render() {
    return (
      <button className="btn btn-default" type="button" onClick={() => {
        // resetDatabase();
        // window.alert("Database reset! Refreshing the page now...");
        // document.location.reload(false);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/resetdb');
        xhr.addEventListener('load', function() {
          window.alert("Database reset! Refreshing the page now...");
          document.location.reload(false);
        });
        xhr.send();
      }}>Reset Mock DB</button>
    );
  }
}
