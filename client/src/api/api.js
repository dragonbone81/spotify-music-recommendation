const getFollowedArtists = (access_token) => {
    return fetch('https://api.spotify.com/v1/me/following?type=artist&limit=50', {headers: {"Authorization": "Bearer " + access_token}})
        .then(response => response.json())
        .then(data => data.artists.items);
};
const getRelatedArtists = (access_token, artist) => {
    return fetch(`https://api.spotify.com/v1/artists/${artist.id}/related-artists`, {headers: {"Authorization": "Bearer " + access_token}})
        .then(response => response.json())
        .then(data => data.artists);
};
const flattenArray = array => {
    return array.reduce((arr, el) => [...arr, ...el], []);
};
const getUniqueArtists = artists => {
    const uniqueArtists = artists.reduce((uniqueArtists, artist) => {
        if (!(artist.id in uniqueArtists)) {
            uniqueArtists[artist.id] = artist;
        }
        return uniqueArtists
    }, {});
    return Object.keys(uniqueArtists).map(artistID => uniqueArtists[artistID])
};
const getUsersRelatedArtists = async (access_token) => {
    const followedArtists = (await getFollowedArtists(access_token)).map(artist => ({id: artist.id}));
    const allRelatedArtists = flattenArray(
        await Promise.all(followedArtists.reduce(
            (allRelatedArtists, artist) => {
                const relatedArtists = getRelatedArtists(access_token, artist);
                return [...allRelatedArtists, relatedArtists]
            }, [])));
    return getUniqueArtists(allRelatedArtists);
};

export {getUsersRelatedArtists}