var express = require('express');
const path = require('path');
var app = express();
var bodyParser = require('body-parser');
var querystring = require('querystring');
// var database = require('./database.js');
// var readDocument = database.readDocument;
var validate = require('express-jsonschema').validate;
// var writeDocument = database.writeDocument;
// var addDocument = database.addDocument;
// var dataCollection = database.dataCollection;
var passport = require('passport');

// var mongo_express = require('mongo-express/lib/middleware');
// // Import the default Mongo Express configuration
// var mongo_express_config = require('mongo-express/config.js');
// app.use('/mongo_express', mongo_express(mongo_express_config));

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var DBurl = 'mongodb://heroku_39clj157:gvpqlgnmmekbcronm1dvdojdcu@ds235775.mlab.com:35775/heroku_39clj157';

MongoClient.connect(DBurl, function(err, db) {


// app.use(express.static('./public'));
// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
// app.use('/*', express.static(path.resolve(__dirname, '../react-ui/build')));

app.use(passport.initialize());
app.use(passport.session());

// var port = process.env.PORT || 3000;
//
// app.listen(port, function () {
//     console.log('Server running at http://127.0.0.1:' + port + '/');
// });

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   if (req.method === 'OPTIONS') {
//     return res.send(200);
//   } else {
//     return next();
//   }
// });

// // All remaining requests return the React app, so it can handle routing.
// app.get('*', function(request, response) {
//   response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

var client_id = 'f926d557a44541e09a2d7f32ffd20969';
var client_secret = '0eaaf77eae0e487094d6119778eaa993';
// var redirect_uri = 'https://guarded-fortress-64455.herokuapp.com/callback'; // Your redirect uri
// var redirect_uri = 'http://localhost:5000/callback'; // Your redirect uri
var redirect_uri = 'https://whispering-chamber-83498.herokuapp.com/callback'; // Your redirect uri


var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : client_id,
  clientSecret : client_secret,
  redirectUri : redirect_uri
});


const SpotifyStrategy = require('passport-spotify').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SpotifyStrategy({
  clientID : client_id,
  clientSecret : client_secret,
  callbackURL : redirect_uri
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    return done(null, profile);
  });
}));

app.use(bodyParser.text());
app.use(bodyParser.json());

app.get('/auth/spotify',
passport.authenticate(
  'spotify',
  {scope: ['user-read-private', 'user-read-email'], showDialog: true}),
  function(req, res) {
      console.log("here!");
  });


app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
      spotifyApi.authorizationCodeGrant(code)
    .then(function(data) {
      console.log('The token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      console.log('The refresh token is ' + data.body['refresh_token']);

      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
      spotifyApi.getMe()
        .then(function(data) {
          console.log('Some information about the authenticated user', data.body.id);
          // res.redirect('https://cryptic-dusk-90102.herokuapp.com/000000000000000000000004');
          // console.log("dataCollection: " + dataCollection('users'));
          // res.redirect('http://localhost:3000/' + data.body.id);
          // res.redirect('http://localhost:3000/000000000000000000000004');
          res.redirect('https://whispering-chamber-83498.herokuapp.com/000000000000000000000004');


        }, function(err) {
          console.log('Something went wrong!', err);
        });
    }, function(err) {
      console.log('Something went wrong!', err);
      res.status(401).end();
    });
  // }
});

// function readDocument(collction, collectionId) {
//   MongoClient.connect(DBurl, function(err, db) {
//     if (err) {
//       throw new Error("Could not connect to database: " + err);
//     } else {
//       console.log("Connected correctly to server.");
//
//       var query = {
//         "_id": collectionId
//       };
//       db.collection('fkd').findOne(query, function(err, doc) {
//         if (err) {
//           throw err;
//         } else {
//           console.log("collectionId: " + collectionId);
//           console.log("collction: " + collction);
//           console.log("Found collection " + collction + ": ");
//           console.log(doc);
//           return doc;
//         }
//       });
//     }
//   });
// }

function resolveUserObjects(userList, callback) {
  if(userList.length === 0) {
    callback(null, {});
  } else {
    var query = {
      $or: userList.map((id) => {return {_id: id } })
    };
    db.collection('users').find(query).toArray(function(err, users) {
      if (err) {
        return callback(err);
      }
      var userMap = {};
      users.forEach((user) => {
        userMap[user._id] = user;
      });
      callback(null, userMap);
    });
  }
}

/**
 * Resolves a feed item. Internal to the server, since it's synchronous.
 */
 function getFeedItem(feedItemId, callback) {
   db.collection('feedItems').findOne({
     _id: feedItemId
   }, function(err, feedItem) {
     if (err) {
       return callback(err);
     } else if (feedItem === null) {
       return callback(null, null);
     }
     var userList = [feedItem.author];
     userList = userList.concat(feedItem.likerList);
     userList = userList.concat(feedItem.groupUsers);
     resolveUserObjects(userList, function(err, userMap) {
       if (err) {
         return callback(err);
       }
       feedItem.author = userMap[feedItem.author];
       feedItem.likerList = feedItem.likerList.map((userId) => userMap[userId]);
       feedItem.groupUsers = feedItem.groupUsers.map((userId) => userMap[userId]);
       callback(null, feedItem);
     });
   });
 }
   // var feedItem = readDocument('feedItems', feedItemId);
   // feedItem.likerList =
   //   feedItem.likerList.map((id) => readDocument('users', id));
   // feedItem.author =
   //   readDocument('users', feedItem.author);
   // feedItem.groupUsers =
   //   feedItem.groupUsers.map((id) => readDocument('users', id));
 //   return feedItem;
 // }

/**
 * Emulates a REST call to get the feed data for a particular user.
 */
function getFeedData(user, callback) {
  // console.log("getFeedData user: " + user);
  db.collection('users').findOne({
    _id: user
  }, function(err, userData) {
    if (err) {
      // console.log("err: " + err);
      return callback(err);
    } else if (userData === null) {
      // console.log("null!!!");
      return callback(null, null);
    }
    // console.log("userData.feed: " + userData.feed);
    db.collection('feeds').findOne({
      _id: userData.feed
    }, function(err, feedData) {
      if (err) {
        return callback(err);
      } else if (feedData === null) {
        return callback(null, null);
      }
      var resolvedContents = [];

      function processNextFeedItem(i) {
        // console.log("feedData.contents[i]: " + feedData.contents[i]);
        getFeedItem(feedData.contents[i], function(err, feedItem) {
          if (err) {
            callback(err);
          } else {
            resolvedContents.push(feedItem);
            if(resolvedContents.length === feedData.contents.length) {
              feedData.contents = resolvedContents;
              callback(null, feedData);
            } else {
              processNextFeedItem(i + 1);
            }
          }
        });
      }

      if(feedData.contents.length === 0) {
        // console.log("feedData.contents.length: " + feedData.contents.length);
        callback(null, feedData);
      } else {
        processNextFeedItem(0);
      }
    });
  });
  // var userData = readDocument('users', user);
  // var feedData = readDocument('feeds', userData.feed);
  // While map takes a callback, it is synchronous, not asynchronous.
  // It calls the callback immediately.
  // feedData.contents = feedData.contents.map(getFeedItemSync);
  // Return FeedData with resolved references.
  // return feedData;
}

app.get('/user/:userid/feed', function(req, res) {
  var userid = req.params.userid;
  var fromUser = getUserIdFromToken(req.get('Authorization'));
  // userid is a string. We need it to be a number.
  // parameters are always strings.
  // var useridNumber = parseInt(userid, 10);
  // console.log(fromUser);
  if (fromUser === userid) {
    // Send response.
    // console.log("userid: " + userid);
    // console.log("ObjectID(userid): " + )
    getFeedData(new ObjectID(userid), function(err, feedData) {
      if (err) {
        res.status(500).send("Database error: " + err);
      } else if (feedData === null) {
        res.status(400).send("Could not look up feed for user " + userid);
      } else {
        // console.log("FEED: ");
        // console.log(feedData);
        res.send(feedData);
      }
    });
  } else {
    res.status(403).end();
  }
});

function getLikedPlaylist(user, callback) {
  // console.log("getLikePlaylist user: " + user);
  db.collection('users').findOne({
    _id: user
  }, function(err, userData) {
    // console.log("userData before: ");
    // console.log(userData);
    var resolvedLikedPlaylist = [];

    function processNextFeedItem(i) {
      getFeedItem(userData.likedPlaylist[i], function(err, feeditem) {
        // console.log("userData.likedPlaylist[i]: " + userData.likedPlaylist[i]);
        if (err) {
          // console.log("err: " + err);
          callback(err);
        } else {
          // console.log("feeditem: ");
          // console.log(feeditem);
          resolvedLikedPlaylist.push(feeditem);
          if(resolvedLikedPlaylist.length === userData.likedPlaylist.length) {
            userData.likedPlaylist = resolvedLikedPlaylist;
            // console.log("userData: ");
            // console.log(userData);
            callback(err, userData.likedPlaylist);
          } else {
            processNextFeedItem(i + 1);
          }
        }
      });
    }

    if(userData.likedPlaylist.length === 0) {
      callback(null, userData);
    } else {
      processNextFeedItem(0);
    }
  });
  // var userData = readDocument('users', user);
  // var likedPlaylist = userData.likedPlaylist.map(getFeedItem);
  // return likedPlaylist;
}

app.get('/user/:userid/likedplaylist', function(req, res) {
  var userid = req.params.userid;
  var fromUser = getUserIdFromToken(req.get('Authorization'));
  // var useridNumber = parseInt(userid, 10);
  // console.log("BAllsack")
  if (fromUser === userid) {
    getLikedPlaylist(new ObjectID(userid), function(err, playlist) {
        if (err) {
          // console.log("err: " + err);
          res.status(500).send("Database error: " + err);
        } else if (playlist === null) {
          // console.log("null!!!!");
          res.status(400).send("Could not look up playlist for user " + userid);
        } else {
          console.warn("LIKEDPLAYLIST: ");
          console.warn(playlist);
          res.send(playlist);
        }
    });
    // res.send(getLikedPlaylist(userid));
  } else {
    res.status(403).end();
  }
});

function getGroupHistory(user, callback) {
  db.collection('users').findOne({
    _id: user
  }, function(err, userData) {
    if (err) throw err;

      var resolvedGroup = [];

      function processNextFeedItem(i) {
        getFeedItem(userData.groups[i], function(err, groups) {
          if (err) {
            callback(err);
          } else {
            // console.log("userData.groups[i]: ");
            // console.log(userData.groups[i]);
            resolvedGroup.push(groups);
            if(userData.groups.length === resolvedGroup.length) {
              userData.groups = resolvedGroup;
              callback(null, userData.groups);
            } else {
              processNextFeedItem(i + 1);
            }
          }
        });
      }

      if(userData.groups.length === 0) {
        callback(null, null);
      } else {
        processNextFeedItem(0);
      }
  });
  // var userData = readDocument('users', user);
  // userData.groups = userData.groups.map(getFeedItem);
  // return userData.groups;
}

app.get('/user/:userid/history', function(req, res) {
  var userid = req.params.userid;
  var fromUser = getUserIdFromToken(req.get('Authorization'));
  // var useridNumber = parseInt(userid, 10);

  if (fromUser === userid) {
    getGroupHistory(new ObjectID(userid), function(err, group) {
      if (err) {
        // console.log("err: " + err);
        res.status(500).send("Database error: " + err);
      } else if (group === null) {
        // console.log("null!!!!");
        res.status(400).send("Could not look up group histry list for user " + userid);
      } else {
        // console.log("HISTORY: ");
        // console.log(group);
        res.send(group);
      }
    })
    // res.send(getGroupHistory(userid));
  } else {
    res.status(403).end();
  }
});

app.get('/feeditem/:feeditemid', function(req, res) {
  var feeditemid = req.params.feeditemid;
  getFeedItem(new ObjectID(feeditemid), function(err, feeditem) {
    if(err) {
      // console.log("err: " + err);
      res.status(500).send("Database error: " + err);
    } else if (feeditem === null) {
      // console.log("null!!!!");
      res.status(400).send("Could not look up feeditem" + feeditemid);
    } else {
      res.send(feeditem);
    }
  })
  // res.send(getFeedItem(feeditemid));
});

//likeFeedItem
// app.put('/feeditem/:feeditemid/likerlist/:userid', function(req, res) {
//   var fromUser = getUserIdFromToken(req.get('Authorization'));
//   var feedItemId = parseInt(req.params.feeditemid, 10);
//   // var userId = parseInt(req.params.userid, 10);
//   var userId = req.params.userid;
//
//   if(fromUser == userId) {
//     var feedItem = readDocument('feedItems', feedItemId);
//     // Normally, we would check if the user already liked this comment.
//     // But we will not do that in this mock server.
//     // ('push' modifies the array by adding userId to the end)
//     feedItem.likerList.push(userId);
//     writeDocument('feedItems', feedItem);
//     var user = readDocument('users', userId);
//     user.likedPlaylist.push(feedItemId);
//     writeDocument('users', user);
//     res.send(feedItem.likerList.map((userId) =>
//       readDocument('users', userId)));
//     // res.send(user.likedPlaylist.map((feedItemId) =>
//     //   readDocument('feedItems', feedItemId)));
//   } else {
//     res.status(401).end()
//   }
// });

//unlikeFeedItem
// app.delete('/feeditem/:feeditemid/likerlist/:userid', function(req, res) {
//   var fromUser = getUserIdFromToken(req.get('Authorization'));
//   var feedItemId = parseInt(req.params.feeditemid, 10);
//   // var userId = parseInt(req.params.userid, 10);
//   var userId = req.params.userid;
//
//   if(fromUser == userId) {
//     var feedItem = readDocument('feedItems', feedItemId);
//     var likeIndex = feedItem.likerList.indexOf(userId);
//     if(likeIndex !== -1) {
//       feedItem.likerList.splice(likeIndex, 1);
//       writeDocument('feedItems', feedItem);
//     }
//     var user = readDocument('users', userId);
//     var groupIndex = user.likedPlaylist.indexOf(feedItemId);
//     if(groupIndex !== -1) {
//       user.likedPlaylist.splice(feedItemId, 1);
//       writeDocument('users', user);
//     }
//     res.send(feedItem.likerList.map((userId) =>
//       readDocument('users', userId)));
//   } else {
//     res.status(401).end()
//   }
// });

//search spotify
app.post('/search', function(req, res) {
  if (typeof(req.body) === 'string') {
    // trim() removes whitespace before and after the query.
    // toLowerCase() makes the query lowercase.
    var queryText = req.body.trim().toLowerCase();
    spotifyApi.searchTracks(queryText)
    .then(function(data) {
      res.send(data.body);
    }, function(err) {
      console.error(err);
      res.status(400).end();
    });
  }
});


var google = require('googleapis');

//search youtube
app.post('/search/youtube', function(req, res) {
  if (typeof(req.body) === 'string') {
    // trim() removes whitespace before and after the query.
    // toLowerCase() makes the query lowercase.
    var queryText = req.body.trim().toLowerCase();
    var service = google.youtube('v3');
    service.search.list({
      maxResults: 10,
      q: queryText,
      part: 'snippet',
      type: 'video',
      key: 'AIzaSyBE8RGhvuETJwtxM3vA2z4x1XDujOuQCXg'
    }, function(err, data) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      res.send(data.items);
    })}
});

// addSong returns a list of track objects
// app.put('/feeditem/:feeditemid/songlist', function(req, res) {
//   if(typeof(req.body) === 'string') {
//       var song = req.body.trim();
//       var feedItemId = parseInt(req.params.feeditemid, 10);
//       var feedItem = readDocument('feedItems', feedItemId);
//       var nextInd = feedItem.songs.spotify.length + feedItem.songs.youtube.length;
//
//       var newObj = {
//           "index": nextInd,
//           "_id": song
//       }
//
//       feedItem.songs.spotify.push(newObj);
//       writeDocument('feedItems', feedItem);
//       var songidlist = [];
//       for(var i = 0; i < feedItem.songs.spotify.length; ++i) {
//         songidlist.push(feedItem.songs.spotify[i]._id);
//       }
//       spotifyApi.getTracks([song])
//       .then(function(data) {
//         // console.log(data.body);
//         res.send(data.body);
//       }, function(err) {
//         console.error(err);
//         res.status(400).end();
//       });
//   }
// });
//
// // removeSong returns a list of track objects
// app.delete('/feeditem/:feeditemid/songlist/:songId', function(req, res) {
//   // if(typeof(req.body) === 'string') {
//       var song = req.params.songId.trim();
//       var feedItemId = parseInt(req.params.feeditemid, 10);
//       var feedItem = readDocument('feedItems', feedItemId);
//       var songIdIndex = -1;
//       var spotify = feedItem.songs.spotify;
//       var songidlist = [];
//       for(var i = 0; i < spotify.length; ++i) {
//         if(spotify[i]._id === song) {
//           songIdIndex = i;
//         } else {
//           songidlist.push(spotify[i]._id);
//         }
//       }
//       if(songIdIndex !== -1) {
//         feedItem.songs.spotify.splice(songIdIndex, 1);
//         writeDocument('feedItems', feedItem);
//       }
//       spotifyApi.getTracks(songidlist)
//       .then(function(data) {
//         // console.log(data.body);
//         res.send(data.body);
//       }, function(err) {
//         console.error(err);
//         res.status(400).end();
//       });
// });
//
//
//get group's songs from spotify
app.get('/feeditem/:feeditemid/spotifysonglist', function(req, res) {

  var feeditemid = req.params.feeditemid;
  getFeedItem(new ObjectID(feeditemid), function(err, feeditem) {
    if(err) {
      // console.log("err: " + err);
      res.status(500).send("Database error: " + err);
    } else if (feeditem === null) {
      // console.log("null!!!!");
      res.status(400).send("Could not look up feeditem " + feeditemid);
    } else {
      var spotify = feeditem.songs.spotify;
      var spotify_list = [];
      for(var i = 0; i < spotify.length; ++i) {
        spotify_list.push(spotify[i]._id);
      }
      // res.send(feeditem);
      spotifyApi.getTracks(spotify_list)
      .then(function(data) {
        // console.log("data.body.tracks[0].name: " + data.body.tracks[0].name);
        res.send(data.body.tracks);
      }, function(err) {
        console.error(err);
        res.status(400).end();
      });
    }
  })

  // var feedItemId = parseInt(req.params.feeditemid, 10);
  // var feedItem = readDocument('feedItems', feedItemId);
  // // console.log(feedItem.songs.spotify);
  // var spotify = feedItem.songs.spotify;
  // var spotify_list = [];
  // for(var i = 0; i < spotify.length; ++i) {
  //   spotify_list.push(spotify[i]._id);
  // }
  // // console.log(spotify_list);
  // spotifyApi.getTracks(spotify_list)
  // .then(function(data) {
  //   // console.log("data.body.tracks[0].name: " + data.body.tracks[0].name);
  //   res.send(data.body.tracks);
  // }, function(err) {
  //   console.error(err);
  //   res.status(400).end();
  // });
});

//get group's songs from youtube
app.get('/feeditem/:feeditemid/youtubesonglist', function(req, res) {

  var feeditemid = req.params.feeditemid;
  getFeedItem(new ObjectID(feeditemid), function(err, feeditem) {
    if(err) {
      // console.log("err: " + err);
      res.status(500).send("Database error: " + err);
    } else if (feeditem === null) {
      // console.log("null!!!!");
      res.status(400).send("Could not look up feeditem " + feeditemid);
    } else {
      var youtube = feeditem.songs.youtube;
      var youtube_list = "";
      for(var i = 0; i < youtube.length; ++i) {
        youtube_list += youtube[i]._id + ', ';
      }

      var service = google.youtube('v3');
      service.videos.list({
        id: youtube_list,
        part: 'snippet',
        key: 'AIzaSyBE8RGhvuETJwtxM3vA2z4x1XDujOuQCXg'
      }, function(err, data) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        res.send(data.items);
      })
    }
  })


});
//
// // addYoutubeSong returns a list of track objects
// app.put('/feeditem/:feeditemid/youtubesonglist', function(req, res) {
//   if(typeof(req.body) === 'string') {
//       var song = req.body.trim();
//       var feedItemId = parseInt(req.params.feeditemid, 10);
//       var feedItem = readDocument('feedItems', feedItemId);
//       var nextInd = feedItem.songs.spotify.length + feedItem.songs.youtube.length;
//
//       var newObj = {
//           "index": nextInd,
//           "_id": song
//       }
//       // console.log("youtube before: ");
//       // console.log(feedItem.songs.youtube);
//       feedItem.songs.youtube.push(newObj);
//       // console.log("youtube after: ");
//       // console.log(feedItem.songs.youtube);
//       writeDocument('feedItems', feedItem);
//       // var songidlist = [];
//       // for(var i = 0; i < feedItem.songs.spotify.length; ++i) {
//       //   songidlist.push(feedItem.songs.spotify[i]._id);
//       // }
//
//       var service = google.youtube('v3');
//       service.videos.list({
//         id: song,
//         part: 'snippet',
//         key: 'AIzaSyBE8RGhvuETJwtxM3vA2z4x1XDujOuQCXg'
//       }, function(err, data) {
//         if (err) {
//           console.log('The API returned an error: ' + err);
//           return;
//         }
//         // console.log(data.items[0]);
//         res.send(data.items);
//         // res.send(data.items[0]);
//       })
//   }
// });
//
// // Reset database.
// app.post('/resetdb', function(req, res) {
//   console.log("Resetting database...");
//   // This is a debug route, so don't do any validation.
//   database.resetDatabase();
//   // res.send() sends an empty response with status code 200
//   res.send();
// });

/**
* Get the user ID from a token. Returns -1 (an invalid ID)
* if it fails.
*/
function getUserIdFromToken(authorizationLine) {
  try {
    // Cut off "Bearer " from the header value.
    var token = authorizationLine.slice(7);
    // Convert the base64 string to a UTF-8 string.
    var regularString = new Buffer(token, 'base64').toString('utf8');
    // Convert the UTF-8 string into a JavaScript object.
    var tokenObj = JSON.parse(regularString);
    var id = tokenObj['id'];
    // Check that id is a number.
    if (typeof id === 'string') {
      return id;
    } else {
      // Not a number. Return -1, an invalid ID.
      return -1;
    }
  } catch (e) {
    // Return an invalid ID.
    return -1;
  }
}

/**
* Translate JSON Schema Validation failures into error 400s.
*/
app.use(function(err, req, res, next) {
  if (err.name === 'JsonSchemaValidation') {
    // Set a bad request http response status
    res.status(400).end();
  } else {
    // It's some other sort of error; pass it to next error middleware handler
    next(err);
  }
});

});
