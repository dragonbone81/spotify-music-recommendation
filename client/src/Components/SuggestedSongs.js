import React, {Component} from 'react';

//TODO select which artists are related
class SuggestedSongs extends Component {
    state = {
        selectedSong: {},
        mousedOver: -1,
        songState: false,
    };

    componentDidMount() {

    }

    songClicked = (song) => {
        if (song.preview_url) {
            if (song.id === this.state.selectedSong.id) {
                if (this.state.songState) {
                    this.setState({songState: false});
                    this.refs.audio_player.pause();
                } else {
                    this.setState({songState: true});
                    this.refs.audio_player.play();
                }
            } else {
                this.setState({selectedSong: song}, () => {
                    this.setState({songState: true});
                    this.refs.audio_player.load();
                    this.refs.audio_player.play();
                })
            }
        }
    };

    render() {
        return (
            <div className="songs-playlist-col">
                {this.state.selectedSong &&
                <div>
                    <audio ref="audio_player" className="audio-control" controls>
                        <source src={this.state.selectedSong.preview_url}/>
                    </audio>
                </div>}
                <div>
                    {this.props.suggestedSongs.map((song, index) => {
                        return (
                            <div className="song-container" key={song.id}
                                 onClick={() => this.songClicked(song)}
                                 onMouseLeave={() => this.setState({mousedOver: -1})}
                                 onMouseEnter={() => this.setState({mousedOver: index})}>
                                {this.state.mousedOver === index || this.state.selectedSong.id === song.id ?
                                    <div className="song-music-icon">
                                        {this.state.songState && this.state.selectedSong.id === song.id ?
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24">
                                                <path d="M11 22h-4v-20h4v20zm6-20h-4v20h4v-20z"/>
                                            </svg>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24">
                                                <path d="M3 22v-20l18 10-18 10z"/>
                                            </svg>
                                        }
                                    </div>
                                    :
                                    <div className="song-music-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"
                                             viewBox="0 0 24 24">
                                            <path
                                                d="M1 13h-1v-1h1v1zm22-1h-1v1h1v-1zm-20-1h-1v3h1v-3zm18 0h-1v3h1v-3zm-14 0h-1v3h1v-3zm10-1h-1v5h1v-5zm-12 0h-1v5h1v-5zm14-1h-1v7h1v-7zm-10 0h-1v7h1v-7zm2-2h-1v10h1v-10zm4 0h-1v10h1v-10zm-2-2h-1v14h1v-14z"/>
                                        </svg>
                                    </div>

                                }
                                <div className="song-div">
                                    <div className="song-name">{song.name}</div>
                                    <div
                                        className="song-artists">{song.artists.map(artist => artist.name).join(", ")}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {this.props.suggestedSongs.length === 0 &&
                <div className="songs-suggested-text">Songs will be added here when artists are selected...</div>}
            </div>
        );
    }
}

export default SuggestedSongs;
