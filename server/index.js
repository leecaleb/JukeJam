var express = require('express')
const path = require('path')
var app = express()
var bodyParser = require('body-parser')
var querystring = require('querystring')
var cookieParser = require('cookie-parser')
var validate = require('express-jsonschema').validate
var passport = require('passport')
var request = require('request')

// SOCKET
var WebSocket = require('ws')
var wss = new WebSocket.Server({ port:8989 })
const users = []
const sockets = []
const broadcast = (data, ws) => {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}

wss.on('connection', (ws) => {
  sockets.push(ws)
  var user
  ws.on('message', (message) => {
    const data = JSON.parse(message)
    user = {
      userId: data.userId,
      username: data.username
    }
    switch (data.type) {
      case 'ADD_USER_SUCCESS': {
        users.push(user)
        ws.send(JSON.stringify({
          type: 'ONLINE_USER_LIST',
          users
        }))
        broadcast({
          type: 'ONLINE_USER_LIST',
          users
        }, ws)
        break
      }
      case 'ADD_SONG_SUCCESS': {
        broadcast({
          type: 'NEW_SONG_ADDED',
          song: data.song
        }, ws)
        break
      }
      case 'PLAY_NEXT': {
        broadcast({
          type: 'NEXT_SONG',
          song: data.nextSong
        }, ws)
        break
      }
      default: break
    }
  })
  ws.on('close', () => {
    var index = users.indexOf(user)
    users.splice(index, 1)
    broadcast({
      type: 'ONLINE_USER_LIST',
      users
    }, ws)
  })
})

var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var DBurl = 'mongodb://heroku_39clj157:gvpqlgnmmekbcronm1dvdojdcu@ds235775.mlab.com:35775/heroku_39clj157'

MongoClient.connect(DBurl, function(err, db) {

app.use(cookieParser())

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')))
app.use(passport.initialize())
app.use(passport.session())

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

var client_id = 'f926d557a44541e09a2d7f32ffd20969';
var client_secret = '1bec0031a63c470ca2e8e21172b3be84';
// var redirect_uri = 'https://guarded-fortress-64455.herokuapp.com/callback'; // Your redirect uri
var redirect_uri = 'http://localhost:5000/callback'; // Your redirect uri
// var redirect_uri = 'https://whispering-chamber-83498.herokuapp.com/callback'; // Your redirect uri


var SpotifyWebApi = require('spotify-web-api-node');

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
}, (accessToken, refreshToken, profile, done) => {
  process.nextTick(function() {
    return done(null, profile);
  });
}));

app.use(bodyParser.text());
app.use(bodyParser.json());

app.get('/auth/spotify', passport.authenticate(
    'spotify',
    {scope: ['user-read-private', 'user-read-email'], showDialog: true}
  ), (req, res) => {}
)

app.get('/callback', function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
      spotifyApi.authorizationCodeGrant(code)
    .then(function(data) {
      console.log('The refresh token is ' + data.body['refresh_token']);
      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
      // res.cookie('refresh_token', spotifyApi.refresh)
      spotifyApi.getMe()
        .then(function(data) {
          db.collection('users').findOne({
            fullName: data.body.id
          }, (err, userData) => {
            if (err) {
              console.log(err)
            } else if (userData === null) {
              db.collection('users').insertOne({
                _id: new ObjectID(),
                fullName: data.body.id,
                img: "",
                feed: {},
                groups: [],
                likedPlaylist:[]
              }, (err, new_user) => {
                if (err) {
                  console.log(err)
                } else {
                  // res.cookie('token', new Buffer(JSON.stringify({ id: new_user.insertedId })).toString('base64'))
                  res.redirect('http://localhost:3000/user/' + new_user.insertedId);
                }
              })
            } else {
              // var token = new Buffer(JSON.stringify({ id: userData._id })).toString('base64');
              res.redirect('http://localhost:3000/user/' + userData._id);
            }
          })

        }, function(err) {
          console.log('Something went wrong!', err);
        });
    }, function(err) {
      console.log('Something went wrong!', err);
      res.status(401).end();
    });
  // }
});

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

app.get('/user/:userid', (req, res) => {
  var userid = req.params.userid
  db.collection('users').findOne({
    _id: new ObjectID(userid)
  }, (err, userData) => {
    if (err) {
      res.status(500).send('Database error: ' + err)
    } else if (userData === null) {
      res.status(400).send('User with id: ' + userid + 'does not exist')
    } else {
      res.status(200).send(userData)
    }
  })
})

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

/**
 * Emulates a REST call to get the feed data for a particular user.
 */
function getFeedData(user, callback) {
  // console.log("getFeedData user: " + user);
  db.collection('users').findOne({
    _id: user
  }, function(err, userData) {
    if (err) {
      return callback(err);
    } else if (userData === null) {
      return callback(null, null);
    }
    db.collection('feeds').findOne({
      _id: userData.feed
    }, function(err, feedData) {
      if (err) {
        return callback(err);
      } else if (feedData === null) {
        return callback(null, []);
      }
      var resolvedContents = [];

      function processNextFeedItem(i) {
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
}

app.get('/user/:userid/feed', function(req, res) {
  var userid = req.params.userid;
    getFeedData(new ObjectID(userid), function(err, feedData) {
      if (err) {
        res.status(500).send("Database error: " + err);
      } else if (feedData === null) {
        res.status(400).send("Could not look up feed for user " + userid);
      } else {
        res.send(feedData);
      }
    });
});

function getLikedPlaylist(user, callback) {
  db.collection('users').findOne({
    _id: user
  }, function(err, userData) {
    var resolvedLikedPlaylist = [];

    function processNextFeedItem(i) {
      getFeedItem(userData.likedPlaylist[i], function(err, feeditem) {
        if (err) {
          callback(err);
        } else {
          resolvedLikedPlaylist.push(feeditem);
          if(resolvedLikedPlaylist.length === userData.likedPlaylist.length) {
            userData.likedPlaylist = resolvedLikedPlaylist;
            callback(err, userData.likedPlaylist);
          } else {
            processNextFeedItem(i + 1);
          }
        }
      });
    }

    if(userData.likedPlaylist.length === 0) {
      callback(null, []);
    } else {
      processNextFeedItem(0);
    }
  });
}

app.get('/user/:userid/likedplaylist', function(req, res) {
  var userid = req.params.userid;
    getLikedPlaylist(new ObjectID(userid), function(err, playlist) {
        if (err) {
          res.status(500).send("Database error: " + err);
        } else if (playlist === null) {
          res.status(400).send("Could not look up playlist for user " + userid);
        } else {
          res.send(playlist);
        }
    });
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
        callback(null, []);
      } else {
        processNextFeedItem(0);
      }
  });
}

app.get('/user/:userid/history', function(req, res) {
  var userid = req.params.userid;
    getGroupHistory(new ObjectID(userid), function(err, group) {
      if (err) {
        res.status(500).send("Database error: " + err);
      } else if (group === null) {
        res.status(400).send("Could not look up group histry list for user " + userid);
      } else {

        res.send(group);
      }
    })
});

app.get('/feeditem/:feeditemid', function(req, res) {
  var feeditemid = req.params.feeditemid;
  getFeedItem(new ObjectID(feeditemid), function(err, feeditem) {
    if(err) {
      res.status(500).send("Database error: " + err);
    } else if (feeditem === null) {
      res.status(400).send("Could not look up feeditem" + feeditemid);
    } else {
      res.send(feeditem);
    }
  })
});

// likeFeedItem
function likeFeedItem(feedItemId, userId, cb) {
  db.collection('users').updateOne({
    _id: userId
  }, {
    $addToSet: {likedPlaylist: feedItemId}
  })

  db.collection('feedItems').findOneAndUpdate({
    _id: feedItemId
  }, {
    $addToSet: {likerList: userId}
  },{
    returnOriginal: false
  }, (err, feedItemData) => {
    if (err) throw err;

    var updatedLikeCounter = feedItemData.value.likerList;

    resolveUserObjects(updatedLikeCounter, function(err, userMap) {
      if (err) {
        cb(err);
      }
      updatedLikeCounter = updatedLikeCounter.map((userId) => userMap[userId]);
      cb(null, updatedLikeCounter);
    });
  })
}

app.put('/feeditem/:feeditemid/likerlist/:userid', function(req, res) {

  var feeditemid = req.params.feeditemid;
  var userId = req.params.userid;

    likeFeedItem(new ObjectID(feeditemid), new ObjectID(userId), (err, updatedLikeCounter) => {
      if(err) {
        res.status(500).send("Database error: " + err);
      } else if (updatedLikeCounter === null) {
        res.status(400).send("Could not look up feeditem" + feeditemid);
      } else {
        res.send(updatedLikeCounter);
      }
    });
});

// unlikeFeedItem
function unlikeFeedItem (feedItemId, userId, cb) {
    db.collection('users').updateOne({
      _id: userId
    }, {
      $pull: {likedPlaylist: feedItemId}
    })

    db.collection('feedItems').findOneAndUpdate({
      _id: feedItemId
    }, {
      $pull: {likerList: userId}
    }, {
      returnOriginal: false
    }, (err, feedItemData) => {
      if (err) throw err

      var updatedLikeCounter = feedItemData.value.likerList
      resolveUserObjects(updatedLikeCounter, (err, userMap) => {
        if (err) {
          cb(err)
        }
        updatedLikeCounter = updatedLikeCounter.map((userId) => userMap[userId])
        cb(null, updatedLikeCounter)
      })
    })
}

app.delete('/feeditem/:feeditemid/likerlist/:userid', function(req, res) {
  var feedItemId = req.params.feeditemid
  var userId = req.params.userid;
  unlikeFeedItem(new ObjectID(feedItemId), new ObjectID(userId), (err, updatedLikeCounter) => {
    console.log(updatedLikeCounter)
    if(err) {
      res.status(500).send("Database error: " + err)
    } else if (updatedLikeCounter === null) {
      res.status(400).send("Could not look up feedItem: " + feedItemId)
    } else {
      res.send(updatedLikeCounter)
    }
  })
});

//search spotify
app.post('/search', function(req, res) {
  if (typeof(req.body) === 'string') {
    var queryText = req.body.trim().toLowerCase();
    spotifyApi.searchTracks(queryText, {limit: 10})
    .then(function(data) {
      res.send(data.body);
    }, function(err) {
      spotifyApi.refreshAccessToken().then((data) => {
        console.log('access token refreshed!')
        spotifyApi.setAccessToken(data.body['access_token'])
        spotifyApi.searchTracks(queryText, {limit:10})
        .then((data) => {
          res.send(data.body)
        }, (err) => {
          console.log(err)
          res.status(400).end()
        })
      }, (err) => {
        console.log('could not refresh access token', err)
      })
    });
  }
});


var google = require('googleapis');

//search youtube
app.post('/search/youtube', function(req, res) {
  if (typeof(req.body) === 'string') {
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

// addSong:Spotify returns a list of track objects
function addSong(feedItemId, songId, cb) {
  db.collection('feedItems').findOne({
    _id: feedItemId
  }, (err, feedItemData) => {
    if (err) throw(err);
    else {

      var newObj = {
        "index": feedItemData.songs.spotify.length + feedItemData.songs.youtube.length,
        "_id": songId
      }

      feedItemData.songs.spotify.push(newObj)

      db.collection('feedItems').updateOne({
        _id: feedItemId
      }, {
        $set: {songs: feedItemData.songs}
      })
      cb(null, feedItemData)
    }
  })
}

app.put('/feeditem/:feeditemid/songlist', function(req, res) {
  if(typeof(req.body) === 'string') {
      var song = req.body.trim();
      var feedItemId = req.params.feeditemid
      var nextInd = -1;

      addSong(new ObjectID(feedItemId), song, (err, feedItem) => {
        if(err) {
          res.status(500).send("Database error: " + err)
        } else if(feedItem === null) {
          res.status(400).send("Could not find feeditem " + feedItemId)
        } else {
          console.log(song)
          spotifyApi.getTracks([song])
          .then(function(data) {
            res.send(data.body);
          }, function(err) {
            spotifyApi.refreshAccessToken().then((data) => {
              console.log('access token refreshed!')
              spotifyApi.setAccessToken(data.body['access_token'])
              spotifyApi.getTracks([song])
              .then((data) => {
                res.send(data.body)
              }, (err) => {
                console.error(err)
                res.status(400).end()
              })
            }, (err) => {
              console.log('could not refresh access token', err)
            })
            // console.error(err);
            // res.status(400).end();
          });
        }
      })
  }
});

// removeSong:Spotify returns a list of track objects
function removeSpotifySong (feedItemId, songId, cb) {
  console.log(songId)
  db.collection('feedItems').findOne({
    _id: feedItemId
  }, (err, feedItemData) => {
    if (err) throw err
    else {
      console.log(feedItemData.songs.spotify)
      var filtered = feedItemData.songs.spotify.filter(obj => obj._id === songId)[0]
      console.log(filtered)
      db.collection('feedItems').findOneAndUpdate({
        _id: feedItemId
      }, {
        $pull: {
          "songs.spotify": filtered
        },
        $inc: {"songs.totalSongs": -1}
      }, {
        returnOriginal: false
      }, (err, feedItem) => {
        if (err) throw err
        else cb(null, feedItem)
      })
    }
  })

}

app.delete('/feeditem/:feeditemid/songlist/:songId', function(req, res) {
    var song = req.params.songId.trim();
    var feedItemId = req.params.feeditemid
    var songidlist = [];
    removeSpotifySong( new ObjectID(feedItemId), song, (err, feedItemData) => {
      if(err) {
        res.status(500).send("Database err: " + err)
      } else if (feedItemData === null) {
        res.status(400).send("Could not find feedItem " + feedItemId)
      } else {
        spotifyApi.getTracks([song])
        .then(function(data) {
          res.send(data.body);
        }, function(err) {
          console.error(err);
          res.status(400).end();
        });
      }
    })
});

//get group's songs from spotify
app.get('/feeditem/:feeditemid/spotifysonglist', function(req, res) {
  var feeditemid = req.params.feeditemid;
  getFeedItem(new ObjectID(feeditemid), function(err, feeditem) {
    if(err) {
      res.status(500).send("Database error: " + err);
    } else if (feeditem === null) {
      res.status(400).send("Could not look up feeditem " + feeditemid);
    } else {
      var spotify = feeditem.songs.spotify;
      var spotify_list = [];
      for(var i = 0; i < spotify.length; ++i) {
        spotify_list.push(spotify[i]._id);
      }
      spotifyApi.getTracks(spotify_list)
      .then(function(data) {
        res.send(data.body.tracks);
      }, function(err) {
        spotifyApi.refreshAccessToken().then((data) => {
          console.log('access token refreshed!')
          spotifyApi.setAccessToken(data.body['access_token'])
          spotifyApi.getTracks(spotify_list)
          .then((data) => {
            res.send(data.body)
          }, (err) => {
            console.error(err)
            res.status(400).end()
          })
        }, (err) => {
          console.log('could not refresh access token', err)
        })
      });
    }
  })
});

//get group's songs from youtube
app.get('/feeditem/:feeditemid/youtubesonglist', function(req, res) {

  var feeditemid = req.params.feeditemid;
  getFeedItem(new ObjectID(feeditemid), function(err, feeditem) {
    if(err) {
      res.status(500).send("Database error: " + err);
    } else if (feeditem === null) {
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

// addYoutubeSong returns a list of track objects
function addYoutubeSong (feedItemId, songId, cb) {
    db.collection('feedItems').findOne({
      _id: feedItemId
    }, (err, feedItemData) => {
      if (err) throw err
      else {
        db.collection('feedItems').updateOne({
          _id: feedItemId
        }, {
          $push: {
            "songs.youtube": {
              "index": feedItemData.songs.totalSongs,
              "_id": songId
            }
          },
          $inc: {
            "songs.totalSongs": 1
          }
        })
        cb(null, feedItemData)
      }
    })
}

app.put('/feeditem/:feeditemid/youtubesonglist', function(req, res) {
  if(typeof(req.body) === 'string') {
      var song = req.body.trim();
      var feedItemId = req.params.feeditemid
      addYoutubeSong (new ObjectID(feedItemId), song, (err, feedItemData) => {
        if(err) {
          res.status(500).send("Database err: " + err)
        } else if (feedItemData === null) {
          res.status(400).send("Could not find feedItem " + feedItemId)
        } else {
        }
      })
      var service = google.youtube('v3');
      service.videos.list({
        id: song,
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
});

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
