var Song = React.createClass({
  getInitialState: function() {
    return {
      playlist: []
    };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(result) {
      var collection = result;

      if (this.isMounted()) {
        this.setState({
          playlist: collection
        });
      }
    }.bind(this));
  },

  render: function() {
  	var playlist = this.state.playlist || [];
		return (
		<ul className="playlist">
		    {playlist.map(function(song, index){
		    	var name = song.artist ? song.artist : song.video_name,
		    		updated_in_ms = Date.parse(song.updated_at),
		    		listItemClassName = (! index) ? 'item fullwidth playing' : 'item fullwidth';

		    	return (
		        <li key={song.id} className={listItemClassName}>
				    <div className="song-meta" data-id={song.video_id} data-time={updated_in_ms} data-name={name}>
				        <div className="title">{song.video_name}</div>
				    </div>
				</li>
				);
		    })}
		</ul>
		);
 	}
});

ReactDOM.render(
  <Song source="playlist" />,
  document.getElementById('playlist-container')
);