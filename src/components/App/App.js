// App.js
import styles from "./App.module.css";
import "./App.css";
import React, { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";

// Main application component
function App() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playlistData, setPlaylistData] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState("");

  // Get access token on component mount
  useEffect(() => {
    setAccessToken(Spotify.getAccessToken());
  }, [accessToken]);

  // Handle search for tracks
  const handleSearch = async (term) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await Spotify.search(term, accessToken);
      setSearchResults(results);
    } catch (error) {
      setError(`Search failed: ${error.message}`);
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save playlist to Spotify
  const handleSavePlaylist = async () => {
    if (!playlistName.trim()) {
      setError("Please enter a playlist name");
      return;
    }

    if (!playlistData.length) {
      setError("Please add some tracks to your playlist");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const trackUris = playlistData
        .filter((track) => track && track.id)
        .map((track) => `spotify:track:${track.id}`);

      console.log("Track URIs to save:", trackUris);

      if (!trackUris.length) {
        throw new Error("No valid track URIs found in playlist");
      }

      await Spotify.savePlaylist(playlistName, trackUris);
      setPlaylistData([]);
      setPlaylistName("New Playlist");
      alert("Playlist saved successfully!");
    } catch (error) {
      const errorMessage = error.message || "Failed to save playlist";
      setError(errorMessage);
      console.error("Failed to save playlist:", error);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className={styles.container}>
        <h1 className={styles.title1}>Spoti</h1>
        <h1 className={styles.title2}>Lists</h1>
      </div>

      {error && (
        <div
          className="error-message"
          style={{ color: "red", margin: "10px 0" }}>
          {error}
        </div>
      )}

      <SearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearch={handleSearch}
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <SearchResults
            searchValue={searchValue}
            playlistData={playlistData}
            setPlaylistData={setPlaylistData}
            songs={searchResults}
          />
          <Playlist
            playlistData={playlistData}
            setPlaylistData={setPlaylistData}
            playlistName={playlistName}
            setPlaylistName={setPlaylistName}
            handleSavePlaylist={handleSavePlaylist}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}

export default App;
