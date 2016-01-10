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
        var playingClass = 'item fullwidth';
        this.state.song.playing === 0 ? playingClass += ' playing' : null;

        return (
            <li className={playingClass}>
                <div className="song-meta"
                     data-id={this.state.song.video_id}
                     data-updated-at={this.state.song.updated_at}
                     data-name={this.state.song.video_name}
                     data-state={this.state.song.playing}>
                    <div className="title">{this.state.song.video_name}</div>
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

  componentDidMount: function() {
    $.get(this.props.source, function(collection) {
        // Set the play state according to current time of the songs collection
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

        if (this.isMounted()) {
            this.setState({
              playlist: collection
            });
        }
    }.bind(this));
  },

  render: function() {
  	var playlist = this.state.playlist.map(function(song){
            return (
                <Song key={song.id} song={song}></Song>
            );
        });

		return (
            <ul className="playlist">
                {playlist}
            </ul>
		);
 	}
});

ReactDOM.render(
  <Playlist source="playlist" />,
  document.getElementById('playlist-container')
);