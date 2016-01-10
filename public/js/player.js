var player,
	playlist = {
		list: '',
		playing: {
			name: '',
			time: 0
		},
		//loadPlaylist: function() {
		//	var $meta = $('.playing > .song-meta');
		//	playlist.playing.time = $meta.data('time');
		//	playlist.playing.name = $meta.data('name');
        //
		//	playlist.list = $('.playlist .item .song-meta')
		//					.map(function() {
		//					    return $(this).data("id");
		//					}).get();
        //
        //
		//	player.loadPlaylist(playlist.list, 0, Math.round((Date.now() - playlist.playing.time) / 1000));
		//},
		loadSong: function(){
			var currentData = $('.playing > .song-meta').data(),
				time = Math.round( (Date.now() - Date.parse(currentData.updatedAt)) / 1000 );

			player.loadVideoById(currentData.id, time);
		},
		changeSong: function(){
			$('.playing').removeClass('playing').next().addClass('playing');
			playlist.loadSong();
		},
		addSong: function(event){
			event.preventDefault();

			$.post('song/add', {
				id: $('.id').val(),
				name: $('.name').val(),
				duration: $('.duration').val()
			}, function(data, textStatus, xhr) {
				console.log(data);
			})
			.always(function(data, textStatus, xhr){
				console.log(data);
				console.log(textStatus);
				console.log(xhr);
			});
		}
	};


function init(){
	// Load youtube API
	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	// Attach listeners
	$('button[add-song]').on('click', playlist.addSong);
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