import { log } from 'console';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import './App.css';

class Coord {
	x: number
	y: number

	constructor(initX: number, initY: number) {
		this.x = initX
		this.y = initY
	}
}

function App() {
	const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 })
	const [positions, setPositions] = useState<Coord[]>([])
	const [closestIndex, setClosestIndex] = useState<number>(-1)

	const [origin, setOrigin] = useState<Coord>()
	const [distances, setDistances] = useState<number[]>([])
	const [order, setOrder] = useState<number[]>([])

	const [shortestDistance, setShortestDistance] = useState<number>(0)
	const [longestDistance, setLongestDistance] = useState<number>(0)

	const [linesToOrigin, setLinesToOrigin] = useState<boolean>()

	const placementArea = useRef(null)

	const [canPlace, setCanPlace] = useState<boolean>(false)
	var place = useRef<boolean>()
	var dists = useRef<number[]>([])

	place.current = canPlace
	dists.current = distances

	useEffect(() => {
		window.addEventListener('mousemove', HandleMousePosition)
		window.addEventListener('mousedown', HandleMouseClick)
		//const holder: any = setInterval(() => InsertionSort(dists.current), 200)

		return () => {
			window.removeEventListener('mousemove', HandleMousePosition)
			window.removeEventListener('mousedown', HandleMouseClick)
			//clearInterval(holder)
		}
	}, [])

	useEffect(() => {
		if(origin) FindClosest(positions, origin)
	}, [origin, positions])

	useEffect(() => {
		InsertionSort(dists.current)
	}, [origin, positions, distances, linesToOrigin])

	const HandleMousePosition = (event: any) => {
		if(!place.current) return
		setMouseCoords({
			x: event.clientX,
			y: event.clientY,
		})
	}
	const HandleMouseClick = (event: any) => {
		if(!place.current) return

		if(event.button === 0) {
			AddPosition(event.clientX, event.clientY)
		} else if(event.button === 1) {
			event.preventDefault()
			SetOrigin(event.clientX, event.clientY)
			return false
		}
	}

	const Clear = () => {
		setMouseCoords({ x: 0, y: 0 })
		setCanPlace(false)
		setDistances([])
		setOrder([])
		setPositions([])
	}

	const AddPosition = (x: number, y: number) => {
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
			
			const distance = SqrDistance(coord, destination)
			if(distance <= shortestDist) {
				shortestDist = distance
				setClosestIndex(i)
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
		<div className="App">
			<div className='nav'><h1>Point Distance Sorter 9000</h1></div>
			<div id='placementArea' onMouseEnter={() => setCanPlace(true)} onMouseLeave={() => setCanPlace(false)}>
				{origin ? <div className='point' id='origin' style={{ left: `${origin.x}px`, top: `${origin.y}px` }}>
				X
				</div>:''}

				{order && positions ? order.map((index: number, ind: number) => {
					return <div
							key={index}
							className='point'
							style={{
								left: `${positions[index].x}px`,
								top: `${positions[index].y}px`,
								backgroundColor: `rgba(${Math.round(GetRelativeDistance(index) * 255)}, ${Math.round((1 - GetRelativeDistance(index)) * 190)}, 0)`
							}}>
							{ind}
							</div>
				}):''}
			</div>

			<p className='debug'>Mouse Position: ({mouseCoords.x}, {mouseCoords.y})</p>
			<button onClick={Clear}>Clear</button>
			<input type="checkbox" onChange={(v: any) => {
				setLinesToOrigin(v.target.value)
			}} id="" />

			<svg>
				{order && positions ? order.map((val: number, index: number) => 
					<polyline
						key={val}
						style={{
							stroke: `rgba(${Math.round(GetRelativeDistance(val) * 255)}, ${Math.round((1 - GetRelativeDistance(val)) * 190)}, 0, 0.4)`
						}}
						points={GetCoordString(index, index-1)}
					/>
				): ''}
			</svg>
		</div>
	);
}

export default App;
