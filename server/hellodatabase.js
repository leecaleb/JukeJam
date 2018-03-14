var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/musicqueue';
MongoClient.connect(url, function(err, db) {
  if (err) {
    throw new Error("Could not connect to database: " + err);
  } else {
    console.log("Connected correctly to server.");

    mongoExample(db);
  }
});

function insertExample(db, callback) {
  var exampleDoc = {
    message: "Hello, world!"
  };
  db.collection('helloworld').insertOne(exampleDoc, function(err, result) {
    if (err) {
      throw err;
    } else {
      console.log("Successfully updated database! The new object's ID is " + result.insertedId);
      callback(result.insertedId);
    }
  });
}

function getHelloWorldDocument(db, id, callback) {
  var query = {
    "_id": id
  };
  db.collection('helloworld').findOne(query, function(err, doc) {
    if (err) {
      throw err;
    } else {
      callback(doc);
    }
  });
}

function mongoExample(db) {
  insertExample(db, function(newId) {
    getHelloWorldDocument(db, newId, function(doc) {
      console.log("Wrote new object to helloworld collection:");
      console.log(doc);
    });
  });
}
