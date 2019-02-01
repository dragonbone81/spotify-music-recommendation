const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:3001";
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
const getRecommendationsBasedOnSeed = async (access_token, seed_artists, options) => {
    const optionsArr = Object.keys(options).map(key => options[key].option === "disabled" ? null : `${options[key].option}_${key}=${options[key].value}`).filter(val => val);
    seed_artists = groupArray(seed_artists, 1).map(seeds => {
        return fetch(`https://api.spotify.com/v1/recommendations?${optionsArr.length > 0 ? "&" + optionsArr.join("&") : ""}&limit=100&market=from_token&seed_artists=${encodeURIComponent(seeds.join())}`, {headers: {"Authorization": "Bearer " + access_token}})
            .then(response => response.json())
            .then(data => data.tracks);
    });
    return getUniquesFromArray(flattenArray(await Promise.all(seed_artists)), 'id');
};
const getSongsFromRecommendations = async (access_token, seed_songs) => {
    seed_songs = groupArray(seed_songs, 50).map(seed_songs => {
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
    if (refreshToken && refreshToken !== 'undefined') {
        return fetch(`${SERVER_URL}/refresh?refresh_token=${refreshToken}`)
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
const createPlaylist = (access_token, userID, playlistInfo) => {
    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: 'POST',
        body: JSON.stringify(playlistInfo),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token,
        }
    }).then(res => res.json());
};
const addTracksToPlaylist = (access_token, playlistID, tracks) => {
    const output = groupArray(tracks, 100).map(tracks => {
        return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            method: 'POST',
            body: JSON.stringify({uris: tracks}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token,
            }
        }).then(res => res.json());
    });
    return Promise.all(output);
};
const createPlaylistAddTracks = async (access_token, tracks, userID, playlistInfo) => {
    const createdPlaylist = await createPlaylist(access_token, userID, playlistInfo);
    await addTracksToPlaylist(access_token, createdPlaylist.id, tracks);
    return createdPlaylist
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
    getUniquesFromArray,
    createPlaylistAddTracks,
}