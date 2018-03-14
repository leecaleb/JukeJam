import {readDocument, writeDocument, addDocument} from './database.js';

/**
 * Emulates how a REST call is *asynchronous* -- it calls your function back
 * some time in the future with data.
 */
function emulateServerReturn(data, cb) {
  // console.log("contents: " + data.contents);
  setTimeout(() => {
    cb(data);
  }, 4);
}

// function getFeedItemSync(feedItemId) {
//   var feedItem = readDocument('feedItems', feedItemId);
//   feedItem.likerList =
//     feedItem.likerList.map((id) => readDocument('users', id));
//   feedItem.author =
//     readDocument('users', feedItem.author);
//   feedItem.groupUsers =
//     feedItem.groupUsers.map((id) => readDocument('users', id));
//   return feedItem;
// }

export function getFeedData(user, cb) {
  // var userData = readDocument('users', user);
  // var feedData = readDocument('feeds', userData.feed);
  // feedData.contents = feedData.contents.map(getFeedItemSync);
  // emulateServerReturn(feedData, cb);
  // console.log("working!");
  sendXHR('GET', '/user/' + user + '/feed', undefined, (xhr) => {
    // Call the callback with the data.
    console.warn(xhr.responseText);
    cb(JSON.parse(xhr.responseText));
  });
}

export function getLikedPlaylist(user, cb) {
  sendXHR('GET', '/user/' + user + '/likedplaylist', undefined, (xhr) => {
    console.warn(xhr.responseText);
    cb(JSON.parse(xhr.responseText));
  });
}

export function getGroupHistory(user, cb) {
  sendXHR('GET', '/user/' + user + '/history', undefined, (xhr) => {
    console.warn(xhr.responseText);
    cb(JSON.parse(xhr.responseText));
  });
}

export function getGroupData(groupId, cb) {
  sendXHR('GET', '/feeditem/' + groupId, undefined, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

export function likeFeedItem(feedItemId, userId, cb) {
  sendXHR('PUT', '/feeditem/' + feedItemId + '/likerlist/' + userId, undefined, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

export function unlikeFeedItem(feedItemId, userId, cb) {
  sendXHR('DELETE', '/feeditem/' + feedItemId + '/likerlist/' + userId, undefined, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

//search spotify
export function searchSong(queryText, cb) {
  sendXHR('POST', '/search', queryText, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

//search youtube
export function searchYoutube(queryText, cb) {
  sendXHR('POST', '/search/youtube', queryText, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

// export function login(cb) {
//   sendXHR('GET', '/login', undefined, (xhr) => {
//     window.location = xhr.responseText;
//   });
// }
//
// export function auth() {
//   sendXHR('POST', '/auth/spotify', undefined, (xhr) => {
//     console.log(xhr.responseText);
//   });
// }

export function addSong(feedItemId, songId, cb) {
  sendXHR('PUT', '/feeditem/' + feedItemId + '/songlist', songId, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

export function removeSong(feedItemId, songId, cb) {
  sendXHR('DELETE', '/feeditem/' + feedItemId + '/songlist/' + songId, undefined, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

// export function getPlaylist(feedItemId, userId, cb) {
//   sendXHR('GET', '/feeditem/' + feedItemId + '/' + userId + '/songlist', undefined, (xhr) => {
//     cb(JSON.parse(xhr.responseText));
//   });
// }

// export function getSong(feedItemId, songIndex, cb) {
//   sendXHR('GET', '/feeditem/' + feedItemId + '/songlist/' + songIndex, undefined, (xhr) => {
//     // console.log("xhr.responseText: " + xhr.responseText);
//     cb(JSON.parse(xhr.responseText));
//   });
// }
// var retArr = [];
// //
// function song(feedItemId, songIndex, playlistLength) {
//
//   sendXHR('GET', '/feeditem/' + feedItemId + '/songlist/' + songIndex, undefined, (xhr) => {
//     // console.log("xhr.responseText: " + xhr.responseText);
//     retArr.push(JSON.parse(xhr.responseText));
//     songIndex++;
//     if(songIndex < playlistLength) {
//       song(feedItemId, songIndex, playlistLength);
//     }
//   });
//   // console.log(retArr);
//   // var copy = retArr.slice();
//   // console.log("copy: " + copy);
//   return retArr;
// }
//
// export function getSong(feedItemId, playlistLength, cb) {
//   // var retArr = [];
//   // for(var i = 0; i < playlistLength; ++i) {
//   //   retArr.push(song(feedItemId, i));
//   // }
//   console.log("song(feedItemId, 0, playlistLength): ");
//   // var copy = song(feedItemId, 0, playlistLength).slice();
//   console.log(song(feedItemId, 0, playlistLength));
//   // console.log(retArr[0]);
//   // console.log(retArr[1]);
//   // var jazz = retArr[0].concat(retArr[1]);
//   // console.log(jazz);
//   // console.log(retArr);
//   // cb(retArr);
// }

// export function getPlaylist(feedItemId, length, cb) {
//   var ret = [];
//   for(var i = 0; i < length; ++i) {
//     console.log("getSong(feedItemId, i): " + getSong(feedItemId, i));
//     ret.push(getSong(feedItemId, i));
//   }
//   console.log("retclient: " + ret);
//   cb(ret);
// }

export function getPlaylist(feedItemId, cb) {
  sendXHR('GET', '/feeditem/' + feedItemId + '/spotifysonglist', undefined, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

export function getYoutubePlaylist(feedItemId, cb) {
  sendXHR('GET', '/feeditem/' + feedItemId + '/youtubesonglist', undefined, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

export function addYoutubeSong(feedItemId, songId, cb) {
  sendXHR('PUT', '/feeditem/' + feedItemId + '/youtubesonglist', songId, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

//to find token, type node and "new Buffer(JSON.stringify({ id: "000000000000000000000004" })).toString('base64');"
// var token = 'eyAiaWQiOiA0IH0NCg==';
var token = 'eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwNCJ9';
// var token = 'eyJpZCI6ImNhbGViNzk0NyJ9'; // <-- Put your base64'd JSON token here

function sendXHR(verb, resource, body, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open(verb, resource);
  xhr.setRequestHeader('Authorization', 'Bearer ' + token);

  // The below comment tells ESLint that AppError is a global.
  // Otherwise, ESLint would complain about it! (See what happens in Atom if
  // you remove the comment...)
  /* global AppError */

  // Response received from server. It could be a failure, though!
  xhr.addEventListener('load', function() {
    var statusCode = xhr.status;
    var statusText = xhr.statusText;
    if (statusCode >= 200 && statusCode < 300) {
      // Success: Status code is in the [200, 300) range.
      // Call the callback with the final XHR object.
      cb(xhr);
    } else {
      // Client or server error.
      // The server may have included some response text with details concerning
      // the error.
      var responseText = xhr.responseText;
      AppError('Could not ' + verb + " " + resource + ": Received " +
		            statusCode + " " + statusText + ": " + responseText);
    }
  });

  // Time out the request if it takes longer than 10,000
  // milliseconds (10 seconds)
  xhr.timeout = 10000;

  // Network failure: Could not connect to server.
  xhr.addEventListener('error', function() {
    AppError('Could not ' + verb + " " + resource +
	              ": Could not connect to the server.");
  });

  // Network failure: request took too long to complete.
  xhr.addEventListener('timeout', function() {
    AppError('Could not ' + verb + " " + resource +
		          ": Request timed out.");
  });

  switch (typeof(body)) {
    case 'undefined':
      // No body to send.
      xhr.send();
      break;
    case 'string':
      // Tell the server we are sending text.
      xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
      xhr.send(body);
      break;
    case 'object':
      // Tell the server we are sending JSON.
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      // Convert body into a JSON string.
      xhr.send(JSON.stringify(body));
      break;
    default:
      throw new Error('Unknown body type: ' + typeof(body));
  }
}
