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


  const handleClick = async(e) => {

    e.preventDefault()
    setLoad('Loading...')
    //var searchstring = randomstring();
    const result = await axios.post(
      `/generate`,
      {location: location},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    var status = result.data.status
    if(status>=400){
      window.location.reload();
    }
    else{
      var {song, artists, image} = result.data
      setImage(image)
      setSong(`${song} - ${artists}`)
      
    }
    //setLoad('Generate')
  }
  const loader = () => {
    setLoad('Generate')
  }
  return (
    <div className="App">
      <header className="App-header">
        <p className="header">Generate Random Song</p>
        <img src={image == '' ?logo : image} className="img" alt="logo" onLoad={loader}/>
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
