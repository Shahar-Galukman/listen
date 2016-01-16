var Application = React.createClass({
    getInitialState: function(){
        return {
            songId: null,
            songName: null,
            songDuration: null
        };
    },

    handleIdChange: function(event){
        this.setState({ songId: event.target.value });
    },

    handleNameChange: function(event){
        this.setState({ songName: event.target.value });
    },

    handleDurationChange: function(event){
        this.setState({ songDuration: event.target.value });
    },

    handleSubmit: function(event){
        event.preventDefault();

        $.post('song/add', {
            id: this.state.songId,
            name: this.state.songName,
            duration: this.state.songDuration
        }, function(data) {});
    },

    render: function(){

        return (
            <div>
                <Playlist source="playlist" />
                <div className="small-6 medium-6 large-6 columns nopadding">
                    <div id="player"></div>
                    <div id="add-song-container" className="small-3 medium-3 large-3">
                        <form>
                            <input type="text" value={this.state.id} onChange={this.handleIdChange}/>
                            <input type="text" value={this.state.name} onChange={this.handleNameChange}/>
                            <input type="text" value={this.state.duration} onChange={this.handleDurationChange}/>
                            <input type="submit" onClick={this.handleSubmit} />
                        </form>
                    </div>
                </div>
            </div>
        );
    }

});

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
        var playingClass = 'item fullwidth',
            state;

        if ( this.state.song.playing === 0 ) {
            playingClass += ' playing';
            state = 'present';
        }


        if ( this.state.song.playing === -1 ) {
            state = 'future';
        } else {
            state = 'past';
        }

        return (
            <li className={playingClass}>
                <div className="song-meta"
                     data-id={this.state.song.video_id}
                     data-updated-at={this.state.song.updated_at}
                     data-name={this.state.song.video_name}
                     data-state={state}>
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

  fetchFromServer: function(){
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

          channel.bind('song-added', function(d) {
              this.fetchFromServer();
          }.bind(this));
      }
  },

  render: function() {
  	var playlist = this.state.playlist.map(function(song){
            return (
                <Song key={song.id} song={song} />
            );
        });

		return (
            <div id="playlist-container" className="small-12 medium-12 large-12 columns nopadding">
                <ul className="playlist">
                    {playlist}
                </ul>
            </div>
		);
 	}
});

ReactDOM.render(
  <Application />,
  document.getElementById('application')
);