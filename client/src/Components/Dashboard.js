import React, {Component} from 'react';
import '../CSS/App.css';
import {getUsersRelatedArtists, getRecommendationsBasedOnSeed, getUserInfo, getFollowedArtists} from '../api/api';

class Dashboard extends Component {
    state = {
        userInfo: {},
        followedArtists: [],
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
                    followedArtists: await getFollowedArtists(access_token)
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
        console.log(indexSearching);
        this.setState({
            followedArtists: this.state.followedArtists.map((artist, index) => {
                if (indexSearching === index) {
                    artist.clicked = !artist.clicked;
                    return artist;
                } else {
                    return artist;
                }
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
                    <div className="followed-artists-title">Followed Artists</div>
                    <div className="followed-artists">
                        {this.state.followedArtists.map((artist, index) => {
                            return (
                                <div className="artist-name-img" key={artist.id}>
                                    <div onClick={() => this.artistClicked(index)} className={`artist-img-upper ${artist.clicked ? "clicked" : ""}`}>
                                        <div className={`artist-img ${artist.clicked ? "clicked" : ""}`}
                                             style={{backgroundImage: `url(${artist.images[1].url})`}}/>
                                        <div className={`middle ${artist.clicked ? "clicked" : ""}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"
                                                 viewBox="0 0 24 24">
                                                <path
                                                    d="M0 11.522l1.578-1.626 7.734 4.619 13.335-12.526 1.353 1.354-14 18.646z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="artist-name">{artist.name}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="background"/>
            </div>
        );
    }
}

export default Dashboard;
