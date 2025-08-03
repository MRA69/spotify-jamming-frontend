// Spotify API credentials
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // Load from .env
const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI; // Load from .env
let accessToken;

const Spotify = {
    // Method to get access token from URL or redirect to Spotify authorization
    getAccessToken() {
        if(accessToken) {
            return accessToken;
        }

        // Check localStorage for an existing access token
        const storedToken = localStorage.getItem("spotify_access_token");
        const expirationTime = localStorage.getItem("spotify_token_expires");

        if(storedToken && expirationTime && Date.now() < expirationTime) {
            accessToken = storedToken;
            return accessToken;
        }

        // Extract access token from URL
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]) * 1000; // Convert to milliseconds
            const expirationTimestamp = Date.now() + expiresIn;

            // Store token in localStorage
            localStorage.setItem("spotify_access_token", accessToken);
            localStorage.setItem("spotify_token_expires", expirationTimestamp);

            // Clean URL by removing token parameters
            window.history.pushState({}, document.title, redirectUri);
            return accessToken;
        } else {
            // Redirect to Spotify authorization
            const scopes = "playlist-modify-public playlist-modify-private user-read-private";
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

            window.location.href = accessUrl;
        }
    },

    // Method to search for tracks on Spotify
    async search(term) {
        if(!term) return [];

        const token = this.getAccessToken();

        try {
            const response = await fetch(
                `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
                {
                    headers: { Authorization: `Bearer ${token}`},
                }
            );

            const jsonResponse = await response.json();
            if(!jsonResponse.tracks) return [];

            // Map the response to a simplified track object
            return jsonResponse.tracks.items.map((track) => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
                albumArt: track.album.images[0]?.url,
            }));
        } catch (error) {
            console.error("Error searching tracks:", error);
            return [];
        }
    },

    // Method to save a playlist to Spotify
    async savePlaylist(name, trackUris) {
        if(!name || !trackUris.length) {
            console.error("Missing required data:", { name, trackUrisLength: trackUris.length });
            return;
        }

        // Validate URIs format
        const validUris = trackUris.filter((uri) => uri && uri.startsWith("spotify:track:"));
        if(validUris.length === 0) {
            console.error("No valid Spotify URIs found:", trackUris);
            throw new Error("No valid track URIs provided");
        }

        const token = this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        try {
            // Get user ID
            console.log("Fetching user data...");
            const userResponse = await fetch("https://api.spotify.com/v1/me", { headers });

            if(!userResponse.ok) {
                throw new Error(`Failed to get user data: ${userResponse.status}`);
            }

            const userData = await userResponse.json();
            console.log("User ID:", userData.id);

            // Create playlist
            console.log("Creating playlist...");
            const playlistResponse = await fetch(
                `https://api.spotify.com/v1/users/${userData.id}/playlists`,
                {
                    headers,
                    method: "POST",
                    body: JSON.stringify({
                        name,
                        public: true,
                        description: "Created with Jammming",
                    }),
                }
            );

            if(!playlistResponse.ok) {
                throw new Error(`Failed to create playlist: ${playlistResponse.status}`);
            }

            const playlistData = await playlistResponse.json();
            console.log("Playlist created:", playlistData.id);

            // Add tracks to playlist
            console.log("Adding tracks to playlist...", validUris);
            const addTracksResponse = await fetch(
                `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
                {
                    headers,
                    method: "POST",
                    body: JSON.stringify({ uris: validUris }),
                }
            );

            if(!addTracksResponse.ok) {
                const errorData = await addTracksResponse.json();
                console.error("Failed to add tracks to playlist", errorData);
                throw new Error(`Failed to add tracks: ${errorData.error?.message || "Unknown error"}`);
            }

            const addTracksData = await addTracksResponse.json();
            console.log("Tracks added successfully:", addTracksData);

            return playlistData.id;
        } catch (error) {
            console.error("Error saving playlist:", error);
            throw error;
        }
    },
}

export default Spotify;