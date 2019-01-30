import React, {Component} from 'react';

class GetByFollowedArtists extends Component {
    componentDidMount() {
    }

    state = {
        selectedBoolean: true
    };

    render() {
        return (
            <div>
                {/*<div className="followed-artists-title">Followed Artists</div>*/}
                <div className="followed-artists">
                    <div
                        onClick={() => {
                            this.props.selectAllArtists(this.state.selectedBoolean);
                            this.setState({selectedBoolean: !this.state.selectedBoolean})
                        }}>
                        {this.state.selectedBoolean ? 'Select ALL' : 'Deselect ALL'}
                    </div>
                    {this.props.followedArtists.map((artist, index) => {
                        return (
                            <div className="artist-name-img" key={artist.id}>
                                <div onClick={() => this.props.artistClicked(index)}
                                     className={`artist-img-upper ${artist.clicked ? "clicked" : ""}`}>
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
        );
    }
}

export default GetByFollowedArtists;
