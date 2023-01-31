import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Checkbox, ToggleButton } from './components/InputComponents';

class Coord {
	x: number
	y: number

	constructor(initX: number, initY: number) {
		this.x = initX
		this.y = initY
	}
}

function App() {
	const [positions, setPositions] = useState<Coord[]>([])
	const [closestIndex, setClosestIndex] = useState<number>(-1)

	const [origin, setOrigin] = useState<Coord>()
	const [distances, setDistances] = useState<number[]>([])
	const [order, setOrder] = useState<number[]>([])

	const [shortestDistance, setShortestDistance] = useState<number>(0)
	const [longestDistance, setLongestDistance] = useState<number>(0)

	const [darkMode, setDarkMode] = useState<boolean>(true)

	const [linesToOrigin, setLinesToOrigin] = useState<boolean>(false)
	const [useFastDistance, setUseFastDistance] = useState<boolean>(true);

	const [width, setWidth] = useState<number>(window.innerWidth)
	
	const placementArea = useRef<HTMLDivElement>(null)
	var canPlace = useRef<boolean>()
	var dists = useRef<number[]>([])

	dists.current = distances

	const isMobile = width <= 768
	var onGoingTouches: Coord[] = []
	const doubleTapDuration = 225

	useEffect(() => {
		window.addEventListener('resize', HandleWindowResize)

		window.addEventListener('mousedown', HandleMouseClick)

		window.addEventListener('touchstart', HandleTouchStart)
		//const holder: any = setInterval(() => InsertionSort(dists.current), 200)
		ResetOrigin()

		return () => {
			window.removeEventListener('resize', HandleWindowResize)

			window.removeEventListener('mousedown', HandleMouseClick)

			window.removeEventListener('touchstart', HandleTouchStart)
			//clearInterval(holder)
		}
	}, [])

	useEffect(() => {
		if(origin) FindClosest(positions, origin)
	}, [origin, positions])

	useEffect(() => {
		InsertionSort(dists.current)
	}, [origin, positions, distances, linesToOrigin])

	const HandleWindowResize = () => {
		setWidth(window.innerWidth)
	}
	const HandleMouseClick = (event: any) => {
		if(!canPlace.current || isMobile) return

		const res = ConvertToLocalSpace(event.clientX, event.clientY)

		if(event.button === 0) {
			AddPosition(res.x, res.y)
		} else if(event.button === 1) {
			event.preventDefault()
			SetOrigin(res.x, res.y)
		}
	}

	const HandleTouchStart = (event: any) => {
		if(!canPlace.current || !isMobile) return
		event.preventDefault()

		const touches = event.changedTouches
		if(touches.length > 1 || touches.length === 0) return

		if(onGoingTouches.length === 0) {
			setTimeout(() => {
				if(onGoingTouches.length === 1) {
					AddPosition(onGoingTouches[0].x, onGoingTouches[0].y)
				} else {
					const mean: Coord = new Coord(
						(onGoingTouches[0].x + onGoingTouches[1].x)/2,
						(onGoingTouches[0].y + onGoingTouches[1].y)/2,
					)
					SetOrigin(mean.x, mean.y)
				}

				onGoingTouches = []
			}, doubleTapDuration)
		}

		onGoingTouches.push(CopyTouch(touches[0]))
	}

	const CopyTouch = ( touch: any ) => {
		const res = ConvertToLocalSpace(touch.pageX, touch.pageY)
		return new Coord(res.x, res.y)
	}

	const ResetOrigin = () => {
		if(!placementArea.current) return

		const x = (placementArea.current.offsetWidth / 2)
		const y = (placementArea.current.offsetHeight / 2)
		setOrigin(new Coord(x, y))
	}

	const Clear = () => {
		canPlace.current = false
		setDistances([])
		setOrder([])
		setPositions([])
		ResetOrigin()
	}

	const ConvertToLocalSpace = (x: number, y: number) => {
		if(!placementArea.current) return { x: 0, y: 0 }

		const newX = x-placementArea.current.offsetLeft
		const newY = y-placementArea.current.offsetTop

		return { x: newX, y: newY }
	}

	const AddPosition = (x: number, y: number) => {
		if(!placementArea.current) return

		if(x >= placementArea.current.offsetWidth || y >= placementArea.current.offsetHeight || x <= 0 || y <= 0) return

		setPositions(prev => {
			let temp: Coord[] = [...prev]
			let coord: Coord = new Coord(x, y)
			temp.push(coord)
			return temp
		})
	}

	const SetOrigin = (x: number, y: number) => {
		setOrigin(new Coord(x, y))
	}

	const Distance = (a: Coord, b: Coord) => {
		const xDiff = a.x - b.x
		const yDiff = a.y - b.y

		return Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))
	}

	const SqrDistance = (a: Coord, b: Coord) => {
		const xDiff = a.x - b.x
		const yDiff = a.y - b.y

		return (xDiff * xDiff) + (yDiff * yDiff)
	}

	const InsertionSort = (inDistances: number[]) => {
		let length = inDistances.length

		let order: number[] = []
		for (let i = 0; i < inDistances.length; i++) { order.push(i) }

		function Swap(indexA: number, indexB: number) {

			let temp: number = order[indexA]

			order[indexA] = order[indexB]
			order[indexB] = temp
		}

		for (let i: number = 1; i <= length; i++) {
			let j: number = i
			while (j > 0 && inDistances[order[j-1]] > inDistances[order[j]]) {
				Swap(j-1, j)
				j = j - 1
			}
		}

		setOrder(order)
	}

	const GetRelativeDistance = (index: number) => {
		if(!distances) return 1

		let adjustedDist: number = distances[index] - shortestDistance
		let adjustedMaxDist: number = longestDistance - shortestDistance

		return adjustedDist / adjustedMaxDist
	}

	const FindClosest = (coords: Coord[], destination: Coord) => {
		let distances: number[] = []
		let shortestDist = Infinity
		let longestDist = -Infinity
		
		for (let i = 0; i < coords.length; i++) {
			const coord = coords[i]
			
			const distance = useFastDistance ? SqrDistance(coord, destination) : Distance(coord, destination)
			if(distance <= shortestDist) {
				shortestDist = distance
			}
			if(distance >= longestDist) {
				longestDist = distance
			}
			distances.push(distance)
		}

		
		setShortestDistance(shortestDist)
		setLongestDistance(longestDist)

		setDistances(distances)
	}

	const GetCoordString = (index: number, prevIndex: number) => {
		let str: string =  ''
		let pos = positions[order[index]]
		
		if(linesToOrigin || prevIndex === -1) {
			if(origin)
				str = `${origin.x},${origin.y} ${pos.x}, ${pos.y}`
		}
		else {
			let prev = positions[order[prevIndex]]
			str = `${prev.x}, ${prev.y} ${pos.x},${pos.y}`
		}

		return str
	}

	return (
		<div className="App" id={darkMode ? 'darkBackground':''}>
			<header id={darkMode ? 'dark':''}>
				<img src="/logo.png" alt="" />
				<h1>Distance Sorter 9000</h1>
				<ToggleButton
					className='darkModeToggle'
					darkMode={darkMode}
					value={darkMode}
					onChange={(val: boolean) => setDarkMode(val)}
				/>
			</header>
			<div className='info FadeIn' id={darkMode ? 'darkModeFont':''}>
				{!isMobile ?
				<>
				<span><b>Left Click:</b> Place Point</span>
				<span><b>Middle Mouse Click:</b> Move Origin</span>
				</>	
				:
				<>
				<span><b>One Tap:</b> Place Point</span>
				<span><b>Double Tap:</b> Move Origin</span>
				</>
				}
			</div>
			{isMobile ? 
				<span
					className='disclaimer'
					id={darkMode?'darkModeFont':''}>
						<b>DISCLAIMER:</b> Some features may not work as intended on mobile.
				</span>:''}
			<div
				className='FadeIn'
				id='placementArea'
				ref={placementArea}
				onMouseEnter={() => canPlace.current = true}
				onMouseLeave={() => canPlace.current = false}
			>
				<div
					className='interactionRegion' 
					onMouseEnter={() => canPlace.current = false}
					onMouseLeave={() => canPlace.current = true}
					onTouchStart={() => canPlace.current = false}
					onTouchEnd={() => canPlace.current = true}
					onTouchCancel={() => canPlace.current = true}
				>
					<button
						className='clearButton'
						onClick={Clear}
					>Clear</button>
				</div>
				{origin ?
				<div
					className='point'
					id='origin'
					style={{ left: `${origin.x}px`, top: `${origin.y}px` }}
				>
				X
				</div>
				:''}

				{order && positions ? order.map((index: number, ind: number) => {
					return <div
							key={index}
							className='point'
							style={{
								left: `${positions[index].x}px`,
								top: `${positions[index].y}px`,
								backgroundColor: `rgba(${Math.round(GetRelativeDistance(index) * 255 + 50)}, ${Math.round((1 - GetRelativeDistance(index)) * 190 + 20)}, 0)`
							}}>
							{ind}
							</div>
				}):''}

				<svg>
					{order && positions ? order.map((val: number, index: number) => 
						<polyline
							key={val}
							style={{
								stroke: `rgba(${Math.round(GetRelativeDistance(val) * 255 + 50)}, ${Math.round((1 - GetRelativeDistance(val)) * 190 + 20)}, 0, 1)`
							}}
							points={GetCoordString(index, index-1)}
						/>
					): ''}
				</svg>
			</div>

			<div className='options'>
				<Checkbox 
					title='Draw To Origin'
					value={linesToOrigin}
					darkMode={darkMode}
					mobile={isMobile}
					onChange={(value: boolean) => {
						setLinesToOrigin(value)
					}} 
				/>
				<Checkbox 
					title='Use Fast Distance'
					value={useFastDistance}
					darkMode={darkMode}
					mobile={isMobile}
					onChange={(value: boolean) => {
						setUseFastDistance(value)
					}} 
				/>
			</div>


			<footer id={darkMode ? 'dark':''}>
				<div className='additionalInfo'>
					<a href="">Linkedin</a>
					<a href="">GitHub</a>
					<a href="">Twitter</a>
				</div>
				<span>Distance Sorter 9000 <b>&copy;</b> Seth Hamm 2023</span>
			</footer>
		</div>
	);
}

export default App;
