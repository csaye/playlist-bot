import React, { useState } from 'react';
import './App.css';
import Spotify from './Spotify';

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

  const search = async(e) => {
    e.preventDefault();
    Spotify.search(title, 'chill', 10, '1000-3000').then(result => {
      if (result.length == 0) window.alert('No tracks found');
      setTracks(result);
    });
  }

  return (
    <div>
      <form onSubmit={search}>
        <input value={title} placeholder="Title" maxLength="64" onChange={(e) => setTitle(e.target.value)} required />
        <button type="submit">Search</button>
      </form>
      {
        tracks?.map(t => (
          <div key={t.id}>
            <p>{t.name} | {t.artist} | {t.album}</p>
          </div>
        ))
      }
    </div>
  );
}

export default App;
