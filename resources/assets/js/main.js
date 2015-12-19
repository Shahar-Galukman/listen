// TODO: Refactor everything and encapsulate!

// Global data/settings object
var data = {
	videoId: '',
	currentTime: 0,
	userType: 'listener' // Default 
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

	// Set user type (until implemented within ACL)
	data.userType 	 = ($('body').hasClass('listener')) ? 'listener' : 'broadcaster';
	data.videoId 	 = $('#data').data('songid') ? $('#data').data('songid') : $('#video-id-value').val();
	data.currentTime = $('#data').data('time') ? $('#data').data('time') : 0;
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
	playVideo();
}

function onPlayerStateChange(event) {
	console.log('state changed');
	if (event.data == YT.PlayerState.PLAYING ) {
		if ( data.userType != 'broadcaster' ) {
			$('.info').html( 'Now playing: <i>' + player.getVideoData().title + '</i>' );
		}

		update();
	}
}

function playVideo() {
	player.playVideo();

	if ( data.userType != 'broadcaster' ) { 
		player.seekTo(data.currentTime);
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
		
		if ( data.userType != 'listener' ) { 
			// update server with playing song values
			$.post('songs', {
				videoId: data.videoId,
				currentTime: data.currentTime
			}, function(data, textStatus, xhr) {
				console.log(data);
			});
		}
	}
	
	requestAnimationFrame(update);
}

$(document).on('click', '#video-id-submit', function(event) {
	data.videoId = $('#video-id-value').val();
	data.currentTime = 0;

	event.preventDefault();
	stopVideo();
	player.loadVideoById( data.videoId )
});

init();