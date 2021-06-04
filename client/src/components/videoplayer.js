import React, { useState, useEffect, useContext, useRef } from "react";
import ReactPlayer from 'react-player/lazy'
import axios from 'axios'

const PlayVideo = ({ play, search, loop }) => {
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
	const [time, setTime] = useState(null)
	const [video, setVideo] = useState(null)
	const [audio, setAudio] = useState(null)
	const [faClass, setClass] = useState("fa-pause")

	const endProgress = (e) => {
		audio.removeAttribute("value")
		audio.removeAttribute("max")
		setClass("fa-play")
	}

	const updateProgress = (e) => {
		let seconds = video.getCurrentTime()
		audio.value = seconds
		time[0].innerText = Math.round(seconds/60).toString().padStart(2,0)+":"+Math.round(seconds%60).toString().padStart(2,0)
	}
	
	const updateStart = (e) => {
		let seconds = video.getDuration()
		audio.max = seconds
		audio.value = video.getCurrentTime()
		time[1].innerText = Math.round(seconds/60).toString().padStart(2,0)+":"+Math.round(seconds%60).toString().padStart(2,0)
	}

	const manipulateDom = (e) => {
		let parent = video.wrapper,
			videoWrapper = parent.firstElementChild
		videoWrapper.style.display = "flex"
		parent.style.height = 0
		audio.setAttribute("max",video.getDuration())
		audio.setAttribute("value", video.getCurrentTime())
	}

	useEffect(() => {
		const getlink = async () => {
			const result = await axios.post(
				`/link`,
				{ search: search },
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			);
			setTime(document.getElementsByClassName("time"))
			//console.log(result)
			setState({ url: result.data.link, playing: true })
		};
		getlink()
	}, [search, play]);
	const { url, pip, playing } = state

	return (
		<>
			<div className="audioPlayer">
				<span className="control-play-pause"><i className={"fa "+faClass}></i></span>
				<span className="time start"></span>
				<progress ref={e => setAudio(e)}></progress>
				<span className="time end"></span>
			</div>
			<ReactPlayer
				ref={e => setVideo(e)}
				onPlay={e => setClass("fa-pause")}
				onPause={e => setClass("fa-play")}
				onReady={e => manipulateDom(e)}
				onStart={e => updateStart(e)}
				onProgress={e => updateProgress(e)}
				onEnded = {e => endProgress(e)}
				url={url}
				pip={pip}
				playing={playing}
				className="videoplayer"
			/>
		</>
	)

}
export default PlayVideo