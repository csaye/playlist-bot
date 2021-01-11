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

  function search() {
    Spotify.search('the', 'chill').then(result => {
      setTracks(result);
    });
  }

  return (
    <div>
      <button onClick={search}>Search</button>
      {
        tracks?.map(t => (
          <div key={t.id}>
            <p>{t.name}</p>
          </div>
        ))
      }
    </div>
  );
}

export default App;
