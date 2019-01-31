import React, {Component} from 'react';
import {createPlaylistAddTracks} from '../api/api'

//TODO select which artists are related
class SuggestedSongsPlaylistCreator extends Component {
    state = {
        playlistName: "",
        playlistDescription: "",
    };

    componentDidMount() {

    }

    createPlaylist = () => {
        const access_token = localStorage.getItem("access_token");
        const tracks = this.props.tracks;
        const userID = this.props.userID;
        const playlistInfo = {
            name: this.state.playlistName,
            description: this.state.playlistDescription,
            public: false,
        }
        createPlaylistAddTracks(access_token, tracks, userID, playlistInfo)
    };

    render() {
        return (
            <div className="suggested-songs-playlist-container">
                Create Playlist
                <input onChange={({target}) => this.setState({playlistName: target.value})}
                       value={this.state.playlistName} placeholder="Playlist name..."/>
                <input onChange={({target}) => this.setState({playlistDescription: target.value})}
                       value={this.state.playlistDescription} placeholder="Playlist description..."/>
                <button onClick={this.createPlaylist}>Create Playlist</button>
            </div>
        );
    }
}

export default SuggestedSongsPlaylistCreator;
