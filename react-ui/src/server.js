import server_url from './config'

export function getUserData(user, cb) {
	sendXHR('GET', '/user/' + user, undefined, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

export function getFeedData(user, cb) {
	sendXHR('GET', '/user/' + user + '/feed', undefined, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

export function getLikedPlaylist(user, cb) {
	sendXHR('GET', '/user/' + user + '/likedplaylist', undefined, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

export function getGroupHistory(user, cb) {
	sendXHR('GET', '/user/' + user + '/history', undefined, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

export function getGroupData(groupId, cb) {
	sendXHR('GET', '/feeditem/' + groupId, undefined, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

export function likeFeedItem(feedItemId, userId, cb) {
	sendXHR('PUT', '/feeditem/' + feedItemId + '/likerlist/' + userId, undefined, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

export function unlikeFeedItem(feedItemId, userId, cb) {
	sendXHR('DELETE', '/feeditem/' + feedItemId + '/likerlist/' + userId, undefined, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

//search spotify
export function searchSong(queryText, cb) {
	sendXHR('POST', '/search', queryText, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

//search youtube
export function searchYoutube(queryText, cb) {
	sendXHR('POST', '/search/youtube', queryText, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

export function addSong(feedItemId, songId, cb) {
	sendXHR('PUT', '/feeditem/' + feedItemId + '/songlist', songId, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

export function removeSong(feedItemId, songId, cb) {
	sendXHR('DELETE', '/feeditem/' + feedItemId + '/songlist/' + songId, undefined, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

export function getPlaylist(feedItemId, cb) {
	sendXHR('GET', '/feeditem/' + feedItemId + '/spotifysonglist', undefined, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

export function getYoutubePlaylist(feedItemId, cb) {
	sendXHR('GET', '/feeditem/' + feedItemId + '/youtubesonglist', undefined, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

export function addYoutubeSong(feedItemId, songId, cb) {
	sendXHR('PUT', '/feeditem/' + feedItemId + '/youtubesonglist', songId, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

export function removeYoutubeSong(feedItemId, songId, cb) {
	sendXHR('DELETE', '/feeditem/' + feedItemId + 'youtubesonglist', songId, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

export function getLyrics(platformType, songName, artistName, cb) {
	sendXHR('GET', '/lyrics/' + platformType + '/' + songName + '/' + artistName, undefined, (xhr) => {
		cb(JSON.parse(xhr.responseText))
	})
}

//to find token, type node and "new Buffer(JSON.stringify({ id: "000000000000000000000004" })).toString('base64');"
var token = document.cookie.slice(6)
function sendXHR(verb, resource, body, cb) {
	var xhr = new XMLHttpRequest()
	const host = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : server_url
	xhr.open(verb, host + resource)
	xhr.setRequestHeader('Authorization', 'Bearer ' + token);

	// The below comment tells ESLint that AppError is a global.
	// Otherwise, ESLint would complain about it! (See what happens in Atom if
	// you remove the comment...)
	/* global AppError */

	// Response received from server. It could be a failure, though!
	xhr.addEventListener('load', function() {
		var statusCode = xhr.status
		var statusText = xhr.statusText
		if (statusCode >= 200 && statusCode < 300) {
			// Success: Status code is in the [200, 300) range.
			// Call the callback with the final XHR object.
			cb(xhr)
		} else {
			// Client or server error.
			// The server may have included some response text with details concerning
			// the error.
			var responseText = xhr.responseText
			AppError('Could not ' + verb + ' ' + resource + ': Received ' + statusCode + ' ' + statusText + ': ' + responseText)
		}
	})

	// Time out the request if it takes longer than 10,000
	// milliseconds (10 seconds)
	xhr.timeout = 20000

	// Network failure: Could not connect to server.
	xhr.addEventListener('error', function() {
		AppError('Could not ' + verb + ' ' + resource + ': Could not connect to the server.')
	})

	// Network failure: request took too long to complete.
	xhr.addEventListener('timeout', function() {
		AppError('Could not ' + verb + ' ' + resource + ': Request timed out.')
	})

	switch (typeof(body)) {
	case 'undefined':
		// No body to send.
		xhr.send()
		break
	case 'string':
		// Tell the server we are sending text.
		xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8')
		xhr.send(body)
		break
	case 'object':
		// Tell the server we are sending JSON.
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
		// Convert body into a JSON string.
		xhr.send(JSON.stringify(body))
		break
	default:
		throw new Error('Unknown body type: ' + typeof(body))
	}
}
