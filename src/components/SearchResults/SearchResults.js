import React, { useState, useEffect } from "react";
import Tracklist from "../Tracklist/Tracklist";
import styles from "./SearchResults.module.css";

// Component to render search results
function SearchResults({ searchValue, playlistData, setPlaylistData, songs }) {
    const [filteredSongs, setFilteredSongs] = useState([]);

    // Filter songs based on search value
    useEffect(() => {
        const results = songs.filter((song) => 
            song.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredSongs(results);
    },[searchValue, songs]);

    return (
        <>
            <h3>{searchValue}</h3>
            {filteredSongs.length > 0 ? (
                <>
                    <h2 className={styles.searchResults}>Search Results</h2>
                    <Tracklist 
                        playlistData={playlistData}
                        setPlaylistData={setPlaylistData}
                        songs={filteredSongs}
                    />
                </>
            ) : (
                <p className={styles.placeholder}>
                    Search a song name to add it to your playlist!
                </p>
            )}
        </>
    );
}

export default SearchResults;