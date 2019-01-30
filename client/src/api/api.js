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
const groupArray = (arr, chunkSize) => {
    return arr.reduce((acc, val, i, arr) => !(i % chunkSize) ? acc.concat([arr.slice(i, i + chunkSize)]) : acc, []);
};
const getRecommendationsBasedOnSeed = async (access_token, seed_artists) => {
    seed_artists = groupArray(seed_artists, 5).map(seeds => {
        //TODO market=from_token
        return fetch(`https://api.spotify.com/v1/recommendations?target_energy=1&limit=100&market=from_token&seed_artists=${encodeURIComponent(seeds.join())}`, {headers: {"Authorization": "Bearer " + access_token}})
            .then(response => response.json())
            .then(data => data.tracks);
    });
    return getUniquesFromArray(flattenArray(await Promise.all(seed_artists)), 'id');
};
const getSongsFromRecommendations = async (access_token, seed_songs) => {
    seed_songs = groupArray(seed_songs, 50).map(seed_songs => {
        //TODO market=from_token
        return fetch(`https://api.spotify.com/v1/tracks?market=from_token&ids=${encodeURIComponent(seed_songs.map(song => song.id).join())}`, {headers: {"Authorization": "Bearer " + access_token}})
            .then(response => response.json())
            .then(data => data.tracks);
    });
    return flattenArray(await Promise.all(seed_songs));
};
const flattenArray = array => {
    return array.reduce((arr, el) => [...arr, ...el], []);
};
const getUniquesFromArray = (nonUniqueArray, uniqueID) => {
    const uniqueArray = nonUniqueArray.reduce((uniqueArray, obj) => {
        if (!(obj[uniqueID] in uniqueArray)) {
            uniqueArray[obj[uniqueID]] = obj;
        }
        return uniqueArray
    }, {});
    return Object.keys(uniqueArray).map(id => uniqueArray[id])
};
const getUsersRelatedArtists = async (access_token) => {
    const followedArtists = (await getFollowedArtists(access_token)).map(artist => ({id: artist.id}));
    const allRelatedArtists = flattenArray(
        await Promise.all(followedArtists.reduce(
            (allRelatedArtists, artist) => {
                const relatedArtists = getRelatedArtists(access_token, artist);
                return [...allRelatedArtists, relatedArtists]
            }, [])));
    return getUniquesFromArray(allRelatedArtists, 'id');
};
const getAccessToken = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
        return fetch(`http://localhost:3001/refresh?refresh_token=${refreshToken}`)
            .then(response => response.json())
            .then(auth => localStorage.setItem("access_token", auth.access_token));
    } else {
        return new Promise(() => null);
    }
};
const getUserInfo = (access_token) => {
    return fetch(`https://api.spotify.com/v1/me`, {headers: {"Authorization": "Bearer " + access_token}})
        .then(response => response.json())
};
const getArtists = (access_token, artistName) => {
    return fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}*&type=artist&decorate_restrictions=true&market=from_token`, {headers: {"Authorization": "Bearer " + access_token}})
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                return {artists: {items: []}}
            } else {
                return data;
            }
        })
};

export {
    getUsersRelatedArtists,
    getRecommendationsBasedOnSeed,
    getAccessToken,
    getUserInfo,
    getFollowedArtists,
    getArtists,
    getRelatedArtists,
    getSongsFromRecommendations,
}