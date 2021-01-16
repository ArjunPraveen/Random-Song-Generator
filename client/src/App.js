import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import axios from 'axios'
function App() {
  const [song, setSong] = useState("Click below!");
  const [image, setImage] = useState('')
  const [load, setLoad] = useState('Generate')
  const [location, setLocation] = useState('US')
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
      //console.log(result)
      token = result.access_token
    };
    auth();
  }, []);

  const randomstring = () =>  {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    
    const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
    let randomSearch = '';
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
    setLoad('Loading...')
    var searchstring = randomstring();
    const result = await axios.post(
      `/generate`,
      {string: searchstring, location: location},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log(result)
    if(result.data.error)
      window.location.reload(); 
    var rand = Math.floor(Math.random() * 50)
    var songname = result.data.tracks.items[rand].name
    var artists = result.data.tracks.items[rand].artists
    var artists_string = '';
    artists.length == 1 ? (artists_string = artists[0].name) : (
      artists_string = artists.map((elem)=> {
        return elem.name
      }).join(' | '))
    setImage(result.data.tracks.items[rand].album.images[0].url)
    setSong(`${songname} - ${artists_string}`)
    setLoad('Generate')
  }
  return (
    <div className="App">
      <header className="App-header">
        <p className="header">Generate Random Song</p>
        <img src={image == '' ?logo : image} className="img" alt="logo" />
        <p>
          {song}
        </p>
        <a
          className="App-link"
          
          target="_blank"
          onClick={handleClick}
        >
          {load}
        </a>
      </header>
    </div>
  );
}

export default App;
