import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef } from "react";
import PlayVideo from './components/videoplayer'
import axios from 'axios'
function App() {
  const [song, setSong] = useState("Click below!");
  const [image, setImage] = useState('')
  const [load, setLoad] = useState('Generate')
  const [location, setLocation] = useState('US')
  const [history, setHistory]=  useState([])
  const [play, setPlay] = useState(true)
  const [loop, setLoop] = useState(false)
  const [url, setURL] = useState('')
  const myRef = useRef(null)
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
    setPlay(false)
    window.scrollTo(0, 0)
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
      const hist = [{song: song, artists : artists, image:image}, ...history]
      if(hist.length>7)
        hist.pop()
      setHistory(hist)
      console.log(history)
    }
    //setLoad('Generate')
  }
  const loader = () => {
    setLoad('Generate')
  }

  const loadPreviousSong = (i,e) => {
    if(i==0)
      return
    console.log(i)
    setSong(`${history[i]["song"]} - ${history[i]["artists"]}`)
    setImage(history[i]["image"])
    var hist = history
    var cur = hist[i]
    hist.splice(i,1)
    hist.splice(0,0,cur)
    setHistory(hist)

  }

  const executeScroll = () => myRef.current.scrollIntoView() 
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
        <br></br>
          {(history.length == 0) ? (<></>): (<a className="App-link" onClick={executeScroll}>History</a>)}
        
        <PlayVideo play={play} search={song} loop={loop}></PlayVideo>
        </header>
      <b>
          History
        </b>
        <br></br>
    
        <div className="history" ref={myRef}>
        
        {history.map((e,i)=> {
          return(<>
          <li><a className="prevSongs" key={i} onClick={(e) => loadPreviousSong(i,e)}>{e.song}</a> 
          <br></br></li>
          </>)
        })}
        </div>
       
    </div>
  );
}

export default App;
