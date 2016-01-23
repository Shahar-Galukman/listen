var SubmitSongForm = React.createClass({
    getInitialState: function(){
        return {
            query: '',
            results: [],
            submitted: false
        };
    },

    handleQueryChange: function(event){
        this.setState({ query: event.target.value });
    },

    resetCollection: function(event) {
        event.preventDefault();
        this.setState({ results: [] });
        this.setState({ query: '' });
    },

    handleClick: function(event){
        // TODO: regex for Youtube id
        var $id = $(event.target).parents('li').data('id');

        if ( $id.length > 0 ) {
            $.post('inquire', {
                id: $id
            }, function(data) {
                data = JSON.parse(data);
                var duration = data.contentDetails.duration,
                    minutes = +duration.match(/\d+/g)[0],
                    seconds = +duration.match(/\d+/g)[1],
                    totalInS = (minutes * 60) + seconds;

                if ( minutes < 30 && ! isNaN(totalInS) ) {
                    $.post('song/add', {
                        id: data.id,
                        name: data.snippet.title,
                        duration: totalInS
                    });
                }

            }.bind(this));
        }

        this.resetCollection(event);
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
                <li key={index} data-id={record.id.videoId} onClick={this.handleClick}>
                    <YoutubeRecord record={record} />
                </li>
            );
        }.bind(this));

        return (
            <div id="add-song-container" className="small-12 medium-12 large-12 columns">
                <div className="row">
                    <form className="small-12 medium-12 large-12 columns">
                        <input type="text"
                               value={this.state.query}
                               onChange={this.handleQueryChange}
                               className="small-10 medium-10 large-10 columns"
                               placeholder="Search song..."/>
                        <div className="close-button" onClick={this.resetCollection}>&times;</div>
                        <button type="submit"
                                disabled={this.state.submitted}
                                onClick={this.handleSubmit}
                                className="small-2 medium-2 large-2 columns fi-magnifying-glass">&nbsp;</button>
                    </form>
                </div>

                <div className="row">
                    <ul className="results small-12 medium-12 large-12 columns">
                        {results}
                    </ul>
                </div>
            </div>
        );
    }
});

var YoutubeRecord = React.createClass({

    render: function(){
        var record = this.props.record;
        return (
            <div>
                <div>
                    <h5 className="title">{record.snippet.title}</h5>
                    <p className="description">{record.snippet.description}</p>
                </div>
                <div>
                    <img src={record.snippet.thumbnails.default.url} alt={record.snippet.title}/>
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

if ( $('#add-song-wrapper').length > 0 ) {
    ReactDOM.render(
        <SubmitSongForm />,
        document.getElementById('add-song-wrapper')
    );
}