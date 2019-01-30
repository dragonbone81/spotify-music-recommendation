import React, {Component} from 'react';

//TODO select which artists are related
class SuggestedSongs extends Component {
    state = {
        selectedSong: null,
    };

    componentDidMount() {

    }

    songClicked = (song) => {
        this.setState({selectedSong: song}, () => {
            this.refs.audio_player.load();
        })
    };

    render() {
        return (
            <div className="songs-playlist-col">
                {this.state.selectedSong && <div>
                    <audio ref="audio_player" className="audio-control" controls>
                        <source src={this.state.selectedSong.preview_url}/>
                    </audio>
                </div>}
                {this.props.suggestedSongs.map(song => {
                    return (
                        <div onClick={() => this.songClicked(song)} key={song.id}>{song.name}
                        </div>
                    )
                })}
                {this.props.suggestedSongs.length === 0 &&
                <div className="songs-suggested-text">Songs will be added here when artists are selected...</div>}
            </div>
        );
    }
}

export default SuggestedSongs;
