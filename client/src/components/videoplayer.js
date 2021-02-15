import React, { useState, useEffect, useContext } from "react";
import ReactPlayer from 'react-player/lazy'
import axios from 'axios'

const PlayVideo =({ play, search, loop }) => {
    // const [url, setURL] = useState('https://youtu.be/Psxqyf3Ffw0')
    
    const [state, setState] = useState({
      url: null,
      pip: false,
      playing: play,
      controls: false,
      light: false,
      volume: 0.8,
      muted: false,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: 1.0,
      loop: false
    })



    useEffect(() => {const getlink = async () => {
          const result = await axios.post(
            `/link`,
            {search: search},
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          //console.log(result)
          //console.log(result)
          setState({url : result.data.link, playing:true})


        };
        getlink()
      }, [search, play]);
    const {url, pip, playing} = state
    
    return(
        <>
            <ReactPlayer
              url={url}
              pip={pip}
              playing={playing} 
            />
        </>
    )
    
}
export default PlayVideo