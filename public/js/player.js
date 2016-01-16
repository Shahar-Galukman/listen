var player,
	playlist = {
		list: '',
		playing: {
			name: '',
			time: 0
		},
		loadSong: function(){
			var currentData = $('.playing > .song-meta').data(),
				time = Math.round( (Date.now() - Date.parse(currentData.updatedAt)) / 1000 );

			player.loadVideoById(currentData.id, time);
		},
		changeSong: function(){
			var $current = $('.playing'),
				$next = $current.next();

			$current.attr('data-state', 'past').removeClass('playing');
			$next.addClass('playing');
			$next.children('.song-meta').attr('data-state', 'present');
			playlist.loadSong();
		}
	};


function init(){
	// Load youtube API
	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

}

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '390',
		width: '640',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
	playlist.loadSong();
}

function onPlayerStateChange(event) {
	console.log('state changed: ' + event.data);
	if (event.data == YT.PlayerState.PLAYING ) {

	}

	if (event.data == YT.PlayerState.ENDED ) {
		playlist.changeSong();
	}
}



init();