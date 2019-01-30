import React, {Component} from 'react';
import '../CSS/App.css';
import {getUsersRelatedArtists, getRecommendationsBasedOnSeed, getUserInfo, getFollowedArtists} from '../api/api';
import GetByFollowedArtists from './GetByFollowedArtists'

class Dashboard extends Component {
    state = {
        userInfo: {},
        followedArtists: [],
        getSongsBFA: false,
    };

    async componentDidMount() {
        if (!localStorage.getItem("access_token") || !localStorage.getItem("refresh_token")) {
            this.props.history.push("/login");
        } else {
            this.props.gettingNewAccessToken.then(async () => {
                const access_token = localStorage.getItem("access_token");
                // const artists = (await getUsersRelatedArtists(access_token)).map(artist => artist.id);
                // const x = await getRecommendationsBasedOnSeed(access_token, artists);
                // console.log(x);
                this.setState({
                    userInfo: await getUserInfo(access_token),
                    followedArtists: (await getFollowedArtists(access_token)).map(artist => {
                        artist.clicked = false;
                        return artist
                    })
                })
            });
            // this.props.gettingNewAccessToken.then((auth)=>{
            //     console.log(auth);
            // })
            // console.log(new Set(x.map(y => y.artists[0].name)))
            // console.log(new Set(x.map(y => y.id)))
        }
    }

    // getAlltracksForAllArtists = async (access_token) => {
    //     const response = await fetch('https://api.spotify.com/v1/me/following?type=artist&limit=50', {headers: {"Authorization": "Bearer " + access_token}});
    //     const artists = (await response.json()).artists.items;
    //     const related_artists = Array.from(new Set(await Promise.all(
    //         artists.reduce((related_artists, artist) => {
    //             const promise = fetch(`https://api.spotify.com/v1/artists/${artist.id}/related-artists`, {headers: {"Authorization": "Bearer " + access_token}}).then((response) => {
    //                 return response.json();
    //             }).then((data) => {
    //                 return data.artists.map(artist => {
    //                     return artist.id
    //                 });
    //             });
    //             return [...related_artists, promise]
    //         }, [])
    //     ).then((resolved) =>
    //         resolved.reduce((related_artists, artists) => {
    //             return [...related_artists, ...artists]
    //         }, [])
    //     )));
    //     const x = await this.getTracks(related_artists, access_token);
    //     console.log(Array.from(new Set(x)))
    // };
    //
    // getTracks = async (related_artists, access_token) => {
    //     let all_tracks = await Promise.all(related_artists.reduce((all_tracks, artist) => {
    //         //TODO loop through limit
    //         const albums = fetch(`https://api.spotify.com/v1/artists/${artist}/albums?include_groups=album,single`, {headers: {"Authorization": "Bearer " + access_token}})
    //             .then(response => response.json())
    //             .then(data => {
    //                 return data.items;
    //             });
    //         const tracks = albums.then(resolved_albums => {
    //             return resolved_albums.reduce((tracks, album) => {
    //                 //TODO loop through limit
    //                 const album_tracks = fetch(`https://api.spotify.com/v1/albums/${album.id}/tracks?limit=50`, {headers: {"Authorization": "Bearer " + access_token}})
    //                     .then(response => response.json())
    //                     .then(data => {
    //                         return data.items.map(el => {
    //                             return el.id
    //                         });
    //                     });
    //                 return [...tracks, album_tracks]
    //             }, []);
    //         });
    //         return [...all_tracks, tracks];
    //     }, [])).then(list => list.map(function (innerPromiseArray) {
    //         return Promise.all(innerPromiseArray);
    //     }));
    //     const x = Promise.all(all_tracks).then((resolved) =>
    //         resolved.reduce((album_tracks, tracks) => {
    //             return [...album_tracks, ...tracks]
    //         }, [])
    //     ).then((resolved) =>
    //         resolved.reduce((album_tracks, tracks) => {
    //             return [...album_tracks, ...tracks]
    //         }, [])
    //     );
    //     return x;
    // };
    artistClicked = (indexSearching) => {
        const newArtist = this.state.followedArtists[indexSearching];
        newArtist.clicked = !newArtist.clicked;
        this.setState({
            followedArtists: [...this.state.followedArtists.slice(0, indexSearching), newArtist, ...this.state.followedArtists.slice(indexSearching + 1)]
        })
    };
    selectAllArtists = (boolean) => {
        this.setState({
            followedArtists: this.state.followedArtists.map(artist => {
                artist.clicked = boolean;
                return artist
            })
        })
    };

    render() {
        return (
            <div className="Dashboard">
                <div className="header">
                    <div className="links">
                        <span>Home</span>
                    </div>
                    <div className="links">
                        <span>Login</span>
                    </div>
                    <div className="user-greet">
                        <span>Hey {this.state.userInfo.display_name}!</span>
                    </div>
                </div>
                <div className="followed-artists-div">
                    <div onClick={() => this.setState({getSongsBFA: !this.state.getSongsBFA})}
                         className="followed-artists-title">Get Songs By Followed Artists
                    </div>
                    {this.state.getSongsBFA && <GetByFollowedArtists selectAllArtists={this.selectAllArtists}
                                                                     followedArtists={this.state.followedArtists}
                                                                     artistClicked={this.artistClicked}/>}
                </div>
                <div className="background"/>
            </div>
        );
    }
}

export default Dashboard;
