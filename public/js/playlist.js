var Application = React.createClass({
    getInitialState: function(){
        return {
            query: 'Search here...',
            results: []
        };
    },

    handleQueryChange: function(event){
        this.setState({ query: event.target.value });
    },

    handleSubmit: function(event){
        event.preventDefault();

        if ( this.state.query.length > 0 ) {
            $.post('search', {
                query: this.state.query
            }, function(data) {
                if ( data != false ) {
                    this.setState({ results: JSON.parse(data) });
                }
            }.bind(this));
        }
    },

    render: function(){
        // TODO: separate to it's own class
        var results = this.state.results.map(function(record, index){
            return (
                <YoutubeRecord key={index} record={record} />
            );
        });

        return (
            <div className="application-inner">
                <div id="playlist-container" className="small-12 medium-6 large-4 columns nopadding">
                    <Playlist source="playlist" />
                </div>

                <div className="small-12 medium-6 large-6 columns">
                    <div className="row">
                        <div id="add-song-container" className="small-12 medium-6 large-6">
                            <form>
                                <input type="text" value={this.state.query} onChange={this.handleQueryChange}/>
                                <input type="submit" onClick={this.handleSubmit} />
                            </form>
                            <ul className="results">
                                {results}
                            </ul>
                        </div>
                    </div>

                    <div className="row">
                        <div className="small-12 medium-6 large-6 columns">
                            <div id="player"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

var YoutubeRecord = React.createClass({
    handleClick: function(event) {

        // TODO: regex for Youtube id
        if ( event.target.dataset.id.length > 0 ) {
            $.post('inquire', {
                id: event.target.dataset.id
            }, function(data) {
                data = JSON.parse(data);
                var duration = data.contentDetails.duration,
                    minutes = duration.match(/\d+/g)[0],
                    seconds = duration.match(/\d+/g)[1],
                    totalInS = (minutes * 60) + seconds;

                if ( minutes < 30 ) {
                    $.post('song/add', {
                        id: data.id,
                        name: data.snippet.title,
                        duration: totalInS
                    });
                }

            }.bind(this));
        }
    },

    render: function(){
        var record = this.props.record;
        return (
            <li data-id={record.id.videoId} onClick={this.handleClick}>
                {record.snippet.title}

            </li>
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
        var playingClass = 'item small-12 medium-12 large-12 columns',
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
  	var playlist = this.state.playlist.map(function(song, index){
            return (
                <Song key={index} song={song} />
            );
        });

		return (
            <ul className="playlist" >
                {playlist}
            </ul>
		);
 	}
});

ReactDOM.render(
  <Application />,
  document.getElementById('application')
);