import React from 'react';

const SelectedArtists = ({selectedArtists, getArtistImage, selectedArtistClicked}) => {
    return (
        <div className="selected-artists">
            {selectedArtists.map((artist, index) => {
                return (
                    <div onClick={() => selectedArtistClicked(index)} className="selected-artists-img-div"
                         key={artist.id}>
                        {getArtistImage(artist.images) ?
                            <div className="selected-artist-img"
                                 style={{backgroundImage: `url(${getArtistImage(artist.images)})`}}/> :
                            <div className="selected-artist-img default">
                                <svg className="default-selected-user-pic" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 24 24">
                                    <path
                                        d="M22 22.966v1.034h-20v-1.034c0-2.1.166-3.312 2.648-3.886 2.804-.647 5.572-1.227 4.241-3.682-3.943-7.274-1.124-11.398 3.111-11.398 4.152 0 7.043 3.972 3.11 11.398-1.292 2.44 1.375 3.02 4.241 3.682 2.483.573 2.649 1.786 2.649 3.886zm-10-21.229c2.228-.004 3.948 1.329 4.492 3.513h1.212c-.528-2.963-2.624-5.25-5.704-5.25s-5.176 2.287-5.704 5.25h1.212c.544-2.184 2.264-3.518 4.492-3.513zm5.542 10.263c1.608 0 2.458-1.507 2.458-3.01 0-1.497-.842-2.99-2.755-2.99.832 1.603.925 3.656.297 6zm-11.112 0c-.632-2.331-.534-4.384.313-6-1.913 0-2.743 1.489-2.743 2.984 0 1.505.843 3.016 2.43 3.016z"/>
                                </svg>
                            </div>}
                        <div className="middle-selected">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                                <path
                                    d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
                            </svg>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default SelectedArtists;
