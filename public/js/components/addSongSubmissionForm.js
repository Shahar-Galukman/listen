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
                    }).success(function(){
                        $(window).trigger('song.added')
                    });
                }

            }.bind(this));
        }

        this.resetCollection(event);
    },

    handleSubmit: function(event){
        event.preventDefault();
        var $submitButton = $('#add-song-container form .fi-magnifying-glass');

        if ( this.state.query.length > 0 ) {
            $submitButton.removeClass('fi-magnifying-glass').addClass('loader');
            $.post('search', {
                query: this.state.query
            }, function(data) {
                if ( data != false ) {
                    this.setState({ results: JSON.parse(data) });
                }

                $submitButton.removeClass('loader').addClass('fi-magnifying-glass');
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

if ( $('#add-song-wrapper').length > 0 ) {
    ReactDOM.render(
        <SubmitSongForm />,
        document.getElementById('add-song-wrapper')
    );

    $(window).one('song.added', function(){
        ReactDOM.unmountComponentAtNode(document.getElementById("add-song-wrapper"));
    });
}