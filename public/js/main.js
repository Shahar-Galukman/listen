// TODO: Refactor everything and encapsulate!

// Global data/settings object
var data = {
	songName: '',
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

	// Pusher time
	if ( data.userType != 'broadcaster' ) {
		
        //var pusher = new Pusher('16311b1fa68b6c4f56e6', {
	    //  encrypted: true
	    //});
        //
	    //var channel = pusher.subscribe('playlist-channel');
	    //channel.bind('track-changed', function(d) {
	    //	console.log('track-changed id: ' + d.id);
			//data.videoId = d.id;
			//changeTrack();
	    //});
	}

	// Broadcaster video change
	$(document).on('click', '#video-id-submit', function(event){
		event.preventDefault();
		data.videoId = $('#video-id-value').val();
		changeTrack();
	});
}

// Triggeres when API has been injected
var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: '2Not8d_Ok1A',
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
	console.log('state changed: ' + event.data);
	if (event.data == YT.PlayerState.PLAYING ) {

		data.songName = player.getVideoData().title;

		if ( data.userType != 'broadcaster' ) {
			$('.info').html( 'Now playing: <i>' + data.songName + '</i>' );
		}

		update();
	} else {
		cancelAnimationFrame(update);
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

function changeTrack() {
	data.currentTime = 0;

	stopVideo();
	player.loadVideoById( data.videoId );

	if ( data.userType != 'listener' ) {
		$.post('change', {id: data.videoId}, function(data){});
	}
}

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
				name: data.songName,
				videoId: data.videoId,
				currentTime: data.currentTime
			}, function(data, textStatus, xhr) {
				console.log(data);
			});
		}
	}
	
	requestAnimationFrame(update);
}

init();