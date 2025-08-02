import React from "react";
import Track from "../Track/Track";
import styles from "./Tracklist.module.css";

// Component to render a list of tracks
function Tracklist({ playlistData, setPlaylistData, songs }) {
  return (
    <div className={styles.tracklist}>
      {songs.map((song) => (
        <Track
          key={song.id}
          id={song.id}
          name={song.name}
          artist={song.artist}
          album={song.album}
          albumArt={song.albumArt}
          playlistData={playlistData}
          setPlaylistData={setPlaylistData}
        />
      ))}
    </div>
  );
}

export default Tracklist;
