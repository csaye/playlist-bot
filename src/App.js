import React, { useState } from 'react';
import './App.css';
import Spotify from './Spotify';

const genres = [
  'any',
  'rock',
  'chill',
  'folk'
];

function App() {
  return (
    <div className="App">
      <section>
        { Spotify.getAccessToken() && <Page /> }
      </section>
    </div>
  );
}

function Page() {
  let [tracks, setTracks] = useState([]);
  let [title, setTitle] = useState('');
  let [genre, setGenre] = useState(genres[0])

  async function search(e) {
    e.preventDefault();
    let g = genre === 'any' ? '' : genre;
    Spotify.search(title, g, 10, '1000-3000').then(result => {
      if (result.length === 0) alert('No tracks found');
      setTracks(result);
    });
  }

  function savePlaylist() {
    let trackURIs = tracks.map(t => {
      return t.uri;
    });
    Spotify.savePlaylist('Bot Playlist', trackURIs);
    alert('Playlist saved successfully');
  }

  return (
    <div>
      <form onSubmit={search}>
        <input value={title} placeholder="Title" maxLength="64" onChange={(e) => setTitle(e.target.value)} />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          {
            genres.map(g => (
              <option key={`genre-${g}`} value={g}>{g}</option>
            ))
          }
        </select>
        <button type="submit">Search</button>
      </form>
      <div>
        {
          tracks.map(t => (
            <div key={t.id}>
              <p>{t.name} | {t.artist} | {t.album}</p>
            </div>
          ))
        }
        { tracks.length > 0 && <button onClick={savePlaylist}>Save Playlist</button> }
      </div>
    </div>
  );
}

export default App;
