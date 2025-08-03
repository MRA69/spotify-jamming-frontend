import React from "react";
import styles from "./Track.module.css";

// Component to render a single track
function Track({
    id,
    name,
    artist,
    album,
    albumArt,
    playlistData,
    setPlaylistData
}) {
    // Handle click on track image to add/remove track from playlist
    function handleImageClick() {
        const isInPlaylist = playlistData.some((song) => song.name === name);
        if(!isInPlaylist) {
            setPlaylistData([...playlistData, { id, name, artist, album, albumArt }]);
        } else {
            setPlaylistData(playlistData.filter((song) => song.name !== name));
        }
    }

    const isInPlaylist = playlistData.some((song) => song.name === name);

    return (
        <div className={`${styles.track} ${isInPlaylist ? styles.inPlaylist : ""}`} onClick={handleImageClick} style={{ cursor: "pointer" }}>
            <img className={styles.img} src={albumArt} alt="Album cover art" />
            <h2 className={styles.title}>{name}</h2>
            <h3 className={styles.artist}>{artist}</h3>
            <p className={styles.album}>{album}</p>
        </div>
    );
}

export default Track;