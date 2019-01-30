import React, {Component} from 'react';
import '../CSS/Dashboard.css';
import {
    getUsersRelatedArtists,
    getRecommendationsBasedOnSeed,
    getUserInfo,
    getFollowedArtists,
    getArtists
} from '../api/api';
import GetByFollowedArtists from './GetByFollowedArtists'
import ArtistSearchBox from './ArtistSearchBox'

class Dashboard extends Component {
    state = {
        userInfo: {},
        followedArtists: [],
        getSongsBFA: false,
        artistSearchInput: "",
        searchedArtists: [],
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
                    // followedArtists: (await getFollowedArtists(access_token)).map(artist => {
                    //     artist.clicked = false;
                    //     return artist
                    // })
                })
            });
            // this.props.gettingNewAccessToken.then((auth)=>{
            //     console.log(auth);
            // })
            // console.log(new Set(x.map(y => y.artists[0].name)))
            // console.log(new Set(x.map(y => y.id)))
        }
    }

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
    changeArtistSearchInput = value => {
        this.setState({artistSearchInput: value}, () => {
            getArtists(localStorage.getItem("access_token"), this.state.artistSearchInput)
                .then(res => this.setState({searchedArtists: res.artists.items}));
        });
    };
    getArtistImage = imageArr => {
        if (imageArr.length !== 0) {
            return imageArr[0].url;
        } else {
            return null;
        }
    };

    render() {
        return (
            <div className="Dashboard">
                <div className="main-content">
                    <ArtistSearchBox artistSearchInput={this.state.artistSearchInput}
                                     changeArtistSearchInput={this.changeArtistSearchInput}/>
                    <div className="search-results">
                        {this.state.searchedArtists.map((artist, index) => {
                            return (
                                <div className="artist-name-img" key={artist.id}>
                                    <div onClick={() => this.artistClicked(index)}
                                         className={`artist-img-upper ${artist.clicked ? "clicked" : ""}`}>
                                        {this.getArtistImage(artist.images) ?
                                            <div className={`artist-img ${artist.clicked ? "clicked" : ""}`}
                                                 style={{backgroundImage: `url(${this.getArtistImage(artist.images)})`}}/> :
                                            <div className={`artist-img ${artist.clicked ? "clicked" : ""}`}>
                                                <svg className="default-user-pic" xmlns="http://www.w3.org/2000/svg" width="100" height="100"
                                                     viewBox="0 0 24 24">
                                                    <path
                                                        d="M22 22.966v1.034h-20v-1.034c0-2.1.166-3.312 2.648-3.886 2.804-.647 5.572-1.227 4.241-3.682-3.943-7.274-1.124-11.398 3.111-11.398 4.152 0 7.043 3.972 3.11 11.398-1.292 2.44 1.375 3.02 4.241 3.682 2.483.573 2.649 1.786 2.649 3.886zm-10-21.229c2.228-.004 3.948 1.329 4.492 3.513h1.212c-.528-2.963-2.624-5.25-5.704-5.25s-5.176 2.287-5.704 5.25h1.212c.544-2.184 2.264-3.518 4.492-3.513zm5.542 10.263c1.608 0 2.458-1.507 2.458-3.01 0-1.497-.842-2.99-2.755-2.99.832 1.603.925 3.656.297 6zm-11.112 0c-.632-2.331-.534-4.384.313-6-1.913 0-2.743 1.489-2.743 2.984 0 1.505.843 3.016 2.43 3.016z"/>
                                                </svg>
                                            </div>}
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
                <div className="songs-playlist-col"></div>
                <div className="background"/>
            </div>
        );
    }
}

export default Dashboard;


{/*<div className="header">*/
}
{/*<div className="links">*/
}
{/*<span>Home</span>*/
}
{/*</div>*/
}
{/*<div className="links">*/
}
{/*<span>Login</span>*/
}
{/*</div>*/
}
{/*<div className="user-greet">*/
}
{/*<span>Hey {this.state.userInfo.display_name}!</span>*/
}
{/*</div>*/
}
{/*</div>*/
}
{/*<div className="followed-artists-div">*/
}
{/*<div onClick={() => this.setState({getSongsBFA: !this.state.getSongsBFA})}*/
}
{/*className="followed-artists-title">Get Songs By Followed Artists*/
}
{/*</div>*/
}
{/*{this.state.getSongsBFA && <GetByFollowedArtists selectAllArtists={this.selectAllArtists}*/
}
{/*followedArtists={this.state.followedArtists}*/
}
{/*artistClicked={this.artistClicked}/>}*/
}
{/*</div>*/
}