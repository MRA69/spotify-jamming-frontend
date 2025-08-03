import React from "react";
import Tracklist from "../Tracklist/Tracklist";
import styles from "./Playlist.module.css";

// Component to render the playlist
function Playlist({
    playlistData,
    setPlaylistData,
    playlistName,
    setPlaylistName,
    handleSavePlaylist,
    isLoading
}) {
    // Handle focus on input to select all text
    const handleFocus = (event) => {
        event.target.select();
    };

    return (
        <>
            <div className={styles.title}>
                <h1 className={styles.title1}>Play</h1>
                <h1 className={styles.title2}>list</h1>
            </div>
            <div className={styles.container}>
                <div className={styles.playlist}>
                    <input 
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        onFocus={handleFocus}
                        className={styles.input}
                        placeholder="Enter Playlist Name"    
                    />
                    <button
                        onClick={handleSavePlaylist}
                        disabled={isLoading || !playlistData.length}
                        className={styles.button}>
                        {isLoading ? "Saving..." : "Save to Spotify"}
                    </button>
                </div>
            </div>
            <Tracklist 
                playlistData={playlistData}
                setPlaylistData={setPlaylistData}
                songs={playlistData}
            />
        </>
    );
}

export default Playlist;