// TODO: Refactor everything and encapsulate!

// Global data/settings object
var data = {
	videoId: '3YR8DCRgmvQ',
	currentTime: 0
}

function init(){
	// Prepare ajax headers
	$.ajaxSetup({
	        headers: {
	            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	        }
	});

	// Load youtube API
	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Triggeres when API has been injected
var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: data.videoId,
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
	event.target.playVideo();
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING) {
		update();
	}
}

function stopVideo() {
	player.stopVideo();
}

var once = true;
var previousSecond = 0
function update(){
	// Get current time seconds (before decimal point)
	var roundedToSeconds = +player.getCurrentTime().toString().split('.')[0];

	// Most accurate 1 second interval considering current play time
	if ( previousSecond != roundedToSeconds ) {
		$('.counter').text(roundedToSeconds);
		data.currentTime = previousSecond = roundedToSeconds;
		// update server with playing song values
		$.post('songs', {
			videoId: data.videoId,
			currentTime: data.currentTime
		}, function(data, textStatus, xhr) {
			console.log(data);
		});
	}
	
	requestAnimationFrame(update);
}

init();