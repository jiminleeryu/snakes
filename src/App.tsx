import React, { useEffect, useRef, useState } from "react"
import "./App.css"
import AppleLogo from "./applePixels.png"
import Monitor from "./monitor.png"
import useInterval from "./useInterval"
import Drake from "./studio.jpg"
import gif from "./fatd_1920x1080.gif"
import axios from 'axios';

const canvasX = 800
const canvasY = 800
const initialSnake = [ [ 4, 10 ], [ 4, 10 ] ]
const initialApple = [ 14, 10 ]
const scale = 50
const timeDelay = 100

interface Props{
    score : number;
	children?: React.ReactNode;
}

function App() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [ snake, setSnake ] = useState(initialSnake)
	const [ apple, setApple ] = useState(initialApple)
	const [ direction, setDirection ] = useState([ 0, -1 ])
	const [ delay, setDelay ] = useState<number | null>(null)
	const [ gameOver, setGameOver ] = useState(false)
	const [ score, setScore ] = useState(0)

	useInterval(() => runGame(), delay)

	useEffect(
		() => {
			let fruit = document.getElementById("fruit") as HTMLCanvasElement
			if (canvasRef.current) {
				const canvas = canvasRef.current
				const ctx = canvas.getContext("2d")
				if (ctx) {
					ctx.setTransform(scale, 0, 0, scale, 0, 0)
					ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
					ctx.fillStyle = "#a3d001"
					snake.forEach(([ x, y ]) => ctx.fillRect(x, y, 1, 1))
					ctx.drawImage(fruit, apple[0], apple[1], 1, 1)
				}
			}
		},
		[ snake, apple, gameOver ]
	)

	function handleSetScore() {
		if (score > Number(localStorage.getItem("snakeScore"))) {
			localStorage.setItem("snakeScore", JSON.stringify(score))
		}
	}

	function play() {
		setSnake(initialSnake)
		setApple(initialApple)
		setDirection([ 1, 0 ])
		setDelay(timeDelay)
		setScore(0)
		setGameOver(false)
	}

	function checkCollision(head: number[]) {
		for (let i = 0; i < head.length; i++) {
			if (head[i] < 0 || head[i] * scale >= canvasX) 
			return true
		}
		for (const s of snake) {
			if (head[0] === s[0] && head[1] === s[1]) 
			return true
		}
		return false
	}

	function appleAte(newSnake: number[][]) {
		let coord = apple.map(() => Math.floor(Math.random() * canvasX / scale))
		if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
			let newApple = coord
			setScore(score + 1)
			setApple(newApple)
			return true
		}
		return false
	}

	function runGame() {
		const newSnake = [ ...snake ]
		const newSnakeHead = [ newSnake[0][0] + direction[0], newSnake[0][1] + direction[1] ]
		newSnake.unshift(newSnakeHead)
		if (checkCollision(newSnakeHead)) {
			setDelay(null)
			setGameOver(true)
			handleSetScore()
		}
		if (!appleAte(newSnake)) {
			newSnake.pop()
		}
		setSnake(newSnake)
	}

	function changeDirection(e: React.KeyboardEvent<HTMLDivElement>) {
		switch (e.key) {
			case "ArrowLeft":
				setDirection([ -1, 0 ])
				break
			case "ArrowUp":
				setDirection([ 0, -1 ])
				break
			case "ArrowRight":
				setDirection([ 1, 0 ])
				break
			case "ArrowDown":
				setDirection([ 0, 1 ])
				break
		}
	}

	useEffect(() => {
		axios.get('/score')
	  .then((response) => {
		setScore(response.data);
	  })
	  .catch((e) => {
		console.log(e);
	  })
	}, [gameOver]);

	return (
    <div className="image-container">
      <img src={Drake} alt="Drake" />
		<div onKeyDown={(e) => changeDirection(e)}>
			<img id="fruit" src={AppleLogo} alt="fruit" width="40" />
			<img src={Monitor} alt="fruit" width="7000" className="monitor" />
			<canvas className="playArea" ref={canvasRef} width={`${canvasX}px`} height={`${canvasY}px`} />
			{gameOver && <div className="gameOver">Game Over</div>}
			<button onClick={play} className="playButton">
				Play
			</button>
		  </div>
      <div className="scoreBox">
				  <h2>Score: {score}</h2>
				  <h2>High Score: {localStorage.getItem("snakeScore")}</h2>
			  </div>
        <div className="gif-overlay">
        <img style={{ width: 200, height: 200 }} src={gif} alt = "logo"/>
      </div>
    </div>
    
	)
}

export default App