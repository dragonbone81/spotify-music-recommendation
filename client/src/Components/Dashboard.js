import React, {Component} from 'react';
import '../CSS/Dashboard.css';
import {
    getRecommendationsBasedOnSeed,
    getUserInfo,
    getArtists,
} from '../api/api';
// import GetByFollowedArtists from './GetByFollowedArtists'
import ArtistSearchBox from './ArtistSearchBox'
import SelectedArtists from './SelectedArtists'
import SuggestedSongs from './SuggestedSongs'
import SuggestedSongsPlaylistCreator from './SuggestedSongsPlaylistCreator'
import SliderOption from './SliderOption'

class Dashboard extends Component {
    state = {
        userInfo: {},
        followedArtists: [],
        getSongsBFA: false,
        artistSearchInput: "",
        searchedArtists: [],
        selectedArtists: [],
        suggestedSongs: [],
        options: false,
        optionsValues: {
            acousticness: {value: 0.30, option: "disabled"},
            danceability: {value: 0.30, option: "disabled"},
            energy: {value: 0.70, option: "target"},
            valence: {value: 0.70, option: "disabled"},
        },
        optionsChanged: false,
    };

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedArtists.map(artist => artist.id).toString() !== this.state.selectedArtists.map(artist => artist.id).toString()) {
            // this.state.selectedArtists.forEach(artist => {
            //     console.log(artist);
            //     getRelatedArtists(localStorage.getItem("access_token"), artist).then(response => console.log(response));
            // })
            // const songs = await getRecommendationsBasedOnSeed(localStorage.getItem("access_token"), this.state.selectedArtists.map(artist => artist.id));
            // const x = await getSongsFromRecommendations(localStorage.getItem("access_token"), songs);
            // this.setState({suggestedSongs: songs});
            this.getRecommendedSongs();
        }
        if (this.state.optionsChanged) {
            this.getRecommendedSongs()
        }
    }

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

    getRecommendedSongs = async () => {
        if (this.state.selectedArtists.length > 0) {
            this.setState({
                optionsChanged: false,
                suggestedSongs:
                    await getRecommendationsBasedOnSeed(localStorage.getItem("access_token"), this.state.selectedArtists.map(artist => artist.id), this.state.optionsValues)
            });
        }
    };
    artistClicked = (indexSearching) => {
        const selectedIndex = this.state.selectedArtists.findIndex(artist => artist.id === this.state.searchedArtists[indexSearching].id);
        const newArtist = {...this.state.searchedArtists[indexSearching]};
        newArtist.clicked = !newArtist.clicked;
        if (selectedIndex !== -1) {
            this.setState({
                selectedArtists: [...this.state.selectedArtists.slice(0, selectedIndex), ...this.state.selectedArtists.slice(selectedIndex + 1)],
                searchedArtists: [...this.state.searchedArtists.slice(0, indexSearching), newArtist, ...this.state.searchedArtists.slice(indexSearching + 1)],
            })
        } else {
            if (this.state.selectedArtists.length < 5) {
                this.setState({
                    selectedArtists: [...this.state.selectedArtists, this.state.searchedArtists[indexSearching]],
                    searchedArtists: [...this.state.searchedArtists.slice(0, indexSearching), newArtist, ...this.state.searchedArtists.slice(indexSearching + 1)],
                })
            }
        }
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
                .then(res => this.setState({
                    searchedArtists: res.artists.items.map(artist => {
                        if (this.state.selectedArtists.some(sArtist => sArtist.id === artist.id)) {
                            artist.clicked = true;
                        }
                        return artist
                    })
                }));
        });
    };
    getArtistImage = imageArr => {
        if (imageArr.length !== 0) {
            return imageArr[imageArr.length - 2].url;
        } else {
            return null;
        }
    };
    selectedArtistClicked = index => {
        const searchedArtistIndex = this.state.searchedArtists.findIndex(artist => artist.id === this.state.selectedArtists[index].id);
        if (searchedArtistIndex !== -1) {
            const newArtist = {...this.state.searchedArtists[searchedArtistIndex]};
            newArtist.clicked = !newArtist.clicked;
            this.setState({
                searchedArtists: [...this.state.searchedArtists.slice(0, searchedArtistIndex), newArtist, ...this.state.searchedArtists.slice(searchedArtistIndex + 1)],
            });
        }
        this.setState({
            selectedArtists: [...this.state.selectedArtists.slice(0, index), ...this.state.selectedArtists.slice(index + 1)]
        });
    };
    selectDeselectAll = (boolean) => {
        this.setState({
            suggestedSongs: this.state.suggestedSongs.map(song => {
                song.selected = boolean;
                return song;
            })
        });
    };
    selectSong = (index) => {
        const newSong = {...this.state.suggestedSongs[index]};
        newSong.selected = !newSong.selected;
        this.setState({
            suggestedSongs: [...this.state.suggestedSongs.slice(0, index), newSong, ...this.state.suggestedSongs.slice(index + 1)],
        });
    };
    changeOptionsValue = (option, value) => {
        if (this.state.optionsValues[option].value === value) {
            return;
        }
        const optionsValues = {...this.state.optionsValues};
        optionsValues[option].value = value;
        this.setState({optionsValues: optionsValues});
    };
    changeFunction = (newOption, optionKey) => {
        if (this.state.optionsValues[optionKey].option === newOption) {
            return;
        }
        const optionsValues = {...this.state.optionsValues};
        optionsValues[optionKey].option = newOption;
        this.setState({optionsValues: optionsValues, optionsChanged: true});
    };
    sliderMouseUp = (key) => {
        if (this.state.optionsValues[key].option !== 'disabled') {
            this.setState({optionsChanged: true});
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
                                                <svg className="default-user-pic" xmlns="http://www.w3.org/2000/svg"
                                                     width="100" height="100"
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
                        <div style={{height: this.state.options ? 200 : 0}}
                             className={`expand-content ${!this.state.options ? "hidden" : ""}`}>
                            <div onClick={() => this.setState({options: !this.state.options})} className="pull-tab">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    {this.state.options ?
                                        <path d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z"/>
                                        :
                                        <path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/>
                                    }
                                </svg>
                            </div>
                            <div onClick={(e) => e.stopPropagation()} className="options-content">
                                {[
                                    {key: "acousticness", value: "Acousticness"},
                                    {key: "danceability", value: "Danceability"},
                                    {key: "energy", value: "Energy"},
                                    {key: "valence", value: "Valence"},
                                ].map(option =>
                                    <SliderOption
                                        sliderMouseUp={() => this.sliderMouseUp(option.key)}
                                        changeFunction={(newOption) => this.changeFunction(newOption, option.key)}
                                        optionFunction={this.state.optionsValues[option.key].option}
                                        key={option.key}
                                        optionName={option.value}
                                        value={this.state.optionsValues[option.key].value}
                                        changeValue={(value) => this.changeOptionsValue(option.key, value)}/>
                                )}
                            </div>

                        </div>
                    </div>
                    {this.state.searchedArtists.length === 0 &&
                    <div className="search-artists-text">Search for artists to be considered in the algorithm...</div>}
                    {this.state.selectedArtists.length > 0 &&
                    <SelectedArtists selectedArtistClicked={this.selectedArtistClicked}
                                     selectedArtists={this.state.selectedArtists}
                                     getArtistImage={this.getArtistImage}/>}
                </div>
                <div className="side-bar">
                    <SuggestedSongs selectSong={this.selectSong} selectDeselectAll={this.selectDeselectAll}
                                    suggestedSongs={this.state.suggestedSongs}/>
                    <SuggestedSongsPlaylistCreator
                        tracks={this.state.suggestedSongs.filter(track => track.selected).map(track => track.uri)}
                        userID={this.state.userInfo.id}/>
                </div>
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