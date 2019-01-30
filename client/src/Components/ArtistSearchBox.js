import React from 'react';

const ArtistSearchBox = ({artistSearchInput, changeArtistSearchInput}) => {
    return (
        <div className="search-block">
            <input value={artistSearchInput}
                   onChange={({target}) => changeArtistSearchInput(target.value)}
                   placeholder="Search for Artists..."/>
        </div>
    );
};

export default ArtistSearchBox;
