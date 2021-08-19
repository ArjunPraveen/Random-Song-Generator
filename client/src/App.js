import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef } from "react";
import PlayVideo from './components/videoplayer'
import axios from 'axios'
import {Circle} from "./Circle"
function App() {
	const [song, setSong] = useState("Click on Generate!");
	const [image, setImage] = useState('')
	const [load, setLoad] = useState('Generate')
	const [location, setLocation] = useState('US')
	const [history, setHistory] = useState([])
	const [play, setPlay] = useState(true)
	const [loop, setLoop] = useState(false)
	const [url, setURL] = useState('')
	const myRef = useRef(null)
	var token;

	let canvas, ctx, ticker = 0,cw = document.body.scrollWidth,ch = document.body.scrollHeight
	let circles
	let spawnRate = 100

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
		canvas = document.querySelector("canvas")
		canvas.width = cw
		canvas.height = ch
		ctx = canvas.getContext("2d")
		circles = []
		animate()
		auth();
	}, []);


	function randomFromRange(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	function animate() {
		requestAnimationFrame(animate)
		ctx.clearRect(0,0,canvas.width,canvas.height)
		circles.forEach((circle, index) => {
			if(circle.r <= 2 | circle.opacity < 0) {
				circles.splice(index, 1)
			}
			circle.update()
		})
		ticker++
		if (ticker % spawnRate === 0) {
			const radius = 140
			let x,y	
			x = randomFromRange(radius, canvas.width)
			y = randomFromRange(canvas.height, canvas.height+400)
			circles.push(new Circle(x, y, radius, "#E3EAEF",ctx))
			spawnRate = randomFromRange(75, 100)
		}
	}

	const handleClick = async (e) => {

		e.preventDefault()
		setPlay(false)
		window.scrollTo(0, 0)
		setLoad('Loading...')
		//var searchstring = randomstring();
		const result = await axios.post(
			`/generate`,
			{ location: location },
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		);
		console.log(result)
		var status = result.data.status
		if (status >= 400) {
			console.log(status, "help")
			//window.location.reload();
		}
		else {
			var { song, artists, image } = result.data
			setImage(image)
			setSong(`${song} - ${artists}`)
			const hist = [{ song: song, artists: artists, image: image }, ...history]
			if (hist.length > 7)
				hist.pop()
			setHistory(hist)
			console.log(history)
			setLoad('Generate')
		}
	}

	const loadPreviousSong = (i, e) => {
		if (i == 0) return
		console.log(i)
		setSong(`${history[i]["song"]} - ${history[i]["artists"]}`)
		setImage(history[i]["image"])
		var hist = history
		var cur = hist[i]
		hist.splice(i, 1)
		hist.splice(0, 0, cur)
		setHistory(hist)

	}

	return (
		<div className="App">
			<header className="App-header">
				<p className="header">Generate Random Song</p>
			</header>
			<a className="App-link" target="_blank" onClick={handleClick} > {load} </a><br/><br/>
			<img src={image == '' ?logo:image} className="img" />
			<p className="songname"> {song} </p>
			<br />
			<PlayVideo play={play} search={song} loop={loop}></PlayVideo>
			<div className="historybox">
				<b className="historytext" onClick={e => myRef.current.classList.toggle("expand")}>History</b>
				<br />
				<div className="history" ref={myRef}>
					{history.map((e, i) => {
						return (<>
							<li className="listInd">
								<a className="prevSongs" key={i} onClick={(e) => loadPreviousSong(i, e)}>{e.song}</a>
								<br />
							</li>
						</>)
					})}
				</div>
			</div>
			<canvas></canvas>
		</div>
	);
}

export default App;
