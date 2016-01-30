var Song = React.createClass({
    getInitialState: function(){
        return {
            song: []
        };
    },

    componentDidMount: function() {
        if (this.isMounted()){
            this.setState({
                song: this.props.song
            });
        }
    },

    render: function(){
        var playingClass = 'item small-12 medium-12 large-12 columns',
            state;

        switch (this.state.song.playing) {
            case 0:
                playingClass += ' playing';
                state = 'present';
                break;
            case 1:
                state = 'past';
                break;
            case -1 :
                state = 'future';
                break;
        }

        return (
            <li className={playingClass}>
                <div className="song-meta"
                     data-id={this.state.song.video_id}
                     data-updated-at={this.state.song.updated_at}
                     data-name={this.state.song.video_name}
                     data-state={state}>
                    <p className="title">{this.state.song.video_name}</p>
                </div>
            </li>
        );
    }
});

var Playlist = React.createClass({
  getInitialState: function() {
    return {
      playlist: []
    };
  },

  // Set the play state according to current time of the songs collection
  markPlaying: function(collection){
      var now = Date.now(),
          foundCurrent = false;

      for ( var i = 0; i < collection.length; i++ ) {
          var time = Date.parse(collection[i].updated_at);

          if ( now - time > 0 ) {
              collection[i].playing = 1;
          } else if ( now - time < 0) {
              collection[i].playing = -1;

              if ( collection[i - 1] && collection[i - 1].playing === 1 && ! foundCurrent ) {
                  collection[i - 1].playing = 0;
                  foundCurrent = true;
              }
          }
      }

      if ( !foundCurrent ) {
          collection[collection.length - 1].playing = 0;
      }

      return collection;
  },

  fetchFromServer: function(){
      $.get(this.props.source, function(collection) {

          collection = this.markPlaying(collection);

          this.setState({
              playlist: collection
          });

      }.bind(this));
  },
  componentDidMount: function() {
      if (this.isMounted()) {
          this.fetchFromServer();

          var pusher = new Pusher('16311b1fa68b6c4f56e6', {
              encrypted: true
          });

          var channel = pusher.subscribe('playlist-channel');

          channel.bind('song-added', function() {
              this.fetchFromServer();
          }.bind(this));
      }
  },

  componentDidUpdate: function() {
      $(window).trigger('playlist.rendered')
  },

  render: function() {
  	var playlist = this.state.playlist.map(function(song, index){
            return (
                <Song key={index} song={song} />
            );
        });

		return (
            <ul className="playlist small-12 medium-12 large-12 columns" >
                {playlist}
            </ul>
		);
 	}
});

ReactDOM.render(
    <Playlist source="playlist" />,
    document.getElementById('playlist-container')
);