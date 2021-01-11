import React, { useState } from 'react';
import './App.css';
import Spotify from './Spotify';
import { genres } from './info/Genres';

const minimumYear = 1960;
const maxOffset = 1000;

// returns a random value between min and max (min inclusive, max exclusive)
const randomRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

function App() {
  return (
    <div className="App">
      <header>
        <h1>Playlist Bot</h1>
      </header>
      <section>
        { Spotify.getAccessToken() && <Page /> }
      </section>
    </div>
  );
}

function Page() {
  let [tracks, setTracks] = useState([]);
  let [terms, setTerms] = useState('');
  let [notTerms, setNotTerms] = useState('');
  let [genre, setGenre] = useState(genres[0]);
  let [minYear, setMinYear] = useState(minimumYear);
  let [maxYear, setMaxYear] = useState(currentYear());
  let [limit, setLimit] = useState(15);
  let [playlistName, setPlaylistName] = useState('');

  let [loading, setLoading] = useState(false);

  function currentYear() {
    let d = new Date();
    return d.getFullYear();
  }

  async function search(e) {
    e.preventDefault();
    setLoading(true);
    setPlaylistName('');

    let g = genre === 'any genre' ? '' : genre;
    let years = `${minYear}-${maxYear}`;
    let offset = randomRange(0, maxOffset);
    let notT = notTerms ? ` NOT ${notTerms}` : '';

    Spotify.search(terms, notT, g, limit, years, offset).then(result => {
      if (result.length === 0) alert('No tracks found');
      setLoading(false);
      setTracks(result);
    });
  }

  function savePlaylist() {
    let trackURIs = tracks.map(t => {
      return t.uri;
    });
    let pName = playlistName ? playlistName : 'New Playlist';
    Spotify.savePlaylist(pName, trackURIs);
    alert(`Playlist "${pName}" saved successfully`);
  }

  function setMinYearLabel(e) {
    setMinYear(e.target.value);
    let l = document.getElementById('minYearLabel');
    if (l) { l.innerHTML = "Min Year: " + e.target.value; }
  }
  function setMaxYearLabel(e) {
    setMaxYear(e.target.value);
    let l = document.getElementById('maxYearLabel');
    if (l) { l.innerHTML = "Max Year: " + e.target.value; }
  }
  function setLimitLabel(e) {
    setLimit(e.target.value);
    let l = document.getElementById('limitLabel');
    if (l) { l.innerHTML = "Track Count: " + e.target.value; }
  }

  return (
    <div className="Page">
      <div className="sidebar">
        <form onSubmit={search}>
          <input className="textInput firstElem" value={terms} placeholder="keyword(s)" maxLength="64" onChange={(e) => setTerms(e.target.value)} />
          <input className="textInput" value={notTerms} placeholder="excluded keyword(s)" maxLength="64" onChange={(e) => setNotTerms(e.target.value)} />

          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            {
              genres.map(g => (
                <option key={`genre-${g}`} value={g}>{g}</option>
              ))
            }
          </select>

          <label htmlFor="range-minyear" id="minYearLabel">Min Year: {minYear}</label>
          <input
          id="range-minyear"
          type="range"
          min={minimumYear} max={currentYear()} defaultValue={minYear}
          step="1"
          onChange={setMinYearLabel}
          / >

          <label htmlFor="range-maxyear" id="maxYearLabel">Max Year: {currentYear()}</label>
          <input
          id="range-maxyear"
          type="range"
          min={minimumYear} max={currentYear()} defaultValue={currentYear()}
          step="1"
          onChange={setMaxYearLabel}
          / >

          <label htmlFor="range-limit" id="limitLabel">Track Count: 15</label>
          <input
          id="range-limit"
          type="range"
          min="1" max="30" defaultValue="15"
          step="1"
          onChange={setLimitLabel}
          / >

          <button type="submit">Generate Playlist</button>
        </form>
      </div>
      <div className="listing">
        {
          loading && <p className="loadingText" id="loadingText">Loading...</p>
        }
        { (tracks.length > 0 && !loading) &&
          <div className="saveTrack">
            <input
            value={playlistName}
            placeholder="playlist name"
            maxLength="64"
            onChange={(e) => setPlaylistName(e.target.value)}
            />
            <button onClick={savePlaylist}>Save Playlist</button>
          </div>
        }
        {
          !loading && tracks.map(t => <Track key={t.id} message={t} />)
        }
      </div>
    </div>
  );
}

function Track(props) {
  const { name, artist, album, image, url } = props.message;

  return (
    <div className="Track">
      <a href={url}>
        <img src={image} alt={album} />
        <div className="text">
          <h1>{name}</h1>
          <p>{artist}</p>
          <p>{album}</p>
        </div>
      </a>
    </div>
  );
}

export default App;
