import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import axios from 'axios'
function App() {
  const [song, setSong] = useState("Click below!");
  const [image, setImage] = useState('')
  var token;
  useEffect(() => {
    const auth = async () => {
      const result = await axios.post(
        `/spotify-client-auth`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(result)
      token = result.access_token
    };
    auth();
  });

  const randomstring = () =>  {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    
    const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
    let randomSearch = '';
  
    // Places the wildcard character at the beginning, or both beginning and end, randomly.
    switch (Math.round(Math.random())) {
      case 0:
        randomSearch = randomCharacter + '%25';
        break;
      case 1:
        randomSearch = '%25' + randomCharacter + '%25';
        break;
    }
  
    return randomSearch;
  }
  const handleClick = async(e) => {
    e.preventDefault()
    var searchstring = randomstring();
    const result = await axios.post(
      `/generate`,
      {string: searchstring},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log(result)
    var rand = Math.floor(Math.random() * 10)
    var songname = result.data.tracks.items[rand].name
    var artists = result.data.tracks.items[rand].artists
    var artists_string = '';
    artists.length == 1 ? (artists_string = artists[0].name) : (
      artists_string = artists.map((elem)=> {
        return elem.name
      }).join(' | '))
    setImage(result.data.tracks.items[rand].album.images[0].url)
    setSong(`${songname} - ${artists_string}`)
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Generate Random Song</h1>
        <img src={image == '' ?logo : image} className="App-logo" alt="logo" />
        <p>
          {song}
        </p>
        <a
          className="App-link"
          
          target="_blank"
          onClick={handleClick}
        >
          Generate
        </a>
      </header>
    </div>
  );
}

export default App;
