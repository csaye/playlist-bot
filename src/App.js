import React, { useState } from 'react';
import './App.css';
import Spotify from './Spotify';
import { genres } from './info/Genres';

const minimumYear = 1960;

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
  let [genre, setGenre] = useState(genres[0]);
  let [minYear, setMinYear] = useState(minimumYear);
  let [maxYear, setMaxYear] = useState(currentYear());

  function currentYear() {
    let d = new Date();
    return d.getFullYear();
  }

  async function search(e) {
    e.preventDefault();
    let g = genre === 'any' ? '' : genre;
    Spotify.search(title, g, 10, `${minYear}-${maxYear}`).then(result => {
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

  function setMinYearLabel(e) {
    setMinYear(e.target.value);
    let l = document.getElementById('minYearLabel');
    if (l) {
      l.innerHTML = e.target.value;
    }
  }

  function setMaxYearLabel(e) {
    setMaxYear(e.target.value);
    let l = document.getElementById('maxYearLabel');
    if (l) {
      l.innerHTML = e.target.value;
    }
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

        <p id="minYearLabel">{minYear}</p>
        <input
        id="range-minyear"
        type="range"
        min={minimumYear} max={currentYear()} defaultValue={minYear}
        step="1"
        onChange={setMinYearLabel}
        / >
        <label htmlFor="range-minyear">Min Year</label>

        <p id="maxYearLabel">{currentYear()}</p>
        <input
        id="range-maxyear"
        type="range"
        min={minimumYear} max={currentYear()} defaultValue={currentYear()}
        step="1"
        onChange={setMaxYearLabel}
        / >
        <label htmlFor="range-maxyear">Max Year</label>

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
