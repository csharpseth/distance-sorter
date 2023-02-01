
import { createContext, useState, useEffect, useRef, useContext } from 'react';
import { BubbleSort, InsertionSort, SelectionSort } from '../helpers/Sorting';
import { DrawType, SortType } from '../ts/enums';
import { ThemeContext } from './ThemeContext';

export const DataContext = createContext({} as any)

class Coord {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

class Area {
    position: Coord
    width: number
    height: number

    constructor(x: number, y: number, width: number, height: number) {
        this.position = new Coord(x, y)
        this.width = width
        this.height = height
    }
}


export function DataProvider(props: any) {
    const [positions, setPositions] = useState<Coord[]>([])

	const [origin, setOrigin] = useState<Coord>()
	const [distances, setDistances] = useState<number[]>([])
	const [order, setOrder] = useState<number[]>([])

	const [shortestDistance, setShortestDistance] = useState<number>(0)
	const [longestDistance, setLongestDistance] = useState<number>(0)

	const [linesToOrigin, setLinesToOrigin] = useState<boolean>(false)
	const [useFastDistance, setUseFastDistance] = useState<boolean>(true);

    const [type, setType] = useState<SortType>(SortType.INSERSTION_SORT)

    var sortType = useRef<SortType>()
    sortType.current = type

    var dists = useRef<number[]>([])
	dists.current = distances

    const placementArea = useRef<HTMLDivElement>()

    const areaPadding = { left: 10, right: 10, top: 10, bottom: 10 }
    const safeArea: Area = new Area(0, 0, 70, 50)

    const { isMobile } = useContext(ThemeContext)

    const ResetOrigin = () => {
		if(!placementArea.current) return
        
		const x = (placementArea.current.offsetWidth / 2)
		const y = (placementArea.current.offsetHeight / 2)

		setOrigin({x, y})
	}

    const CanPlace = (x: number, y: number):boolean => {
        if(!placementArea.current) return false
        
        if(x >= safeArea.position.x && x <= safeArea.position.x + safeArea.width) {
            if(y >= safeArea.position.y && y <= safeArea.position.y + safeArea.height) {
                if(isMobile) {
                    Clear()
                }
                return false
            }
        }

        const place = (
            x > areaPadding.left
            &&
            y > areaPadding.top
            &&
            x < placementArea.current.offsetWidth - areaPadding.right
            &&
            y < placementArea.current.offsetHeight - areaPadding.bottom)

        return place
    }

	const Clear = () => {
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
		if(!CanPlace(x, y)) return

		setPositions(prev => {
			let temp: Coord[] = [...prev]
			let coord: Coord = {x, y}
			temp.push(coord)
			return temp
		})
	}

	const SetOrigin = (x: number, y: number) => {
        if(!CanPlace(x, y)) return

		setOrigin({x, y})
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

    var onGoingTouches: Coord[] = []
	const doubleTapDuration = 225

	const HandleMouseClick = (event: any) => {
		if(isMobile) return

		const res = ConvertToLocalSpace(event.clientX, event.clientY)

		if(event.button === 0) {
			AddPosition(res.x, res.y)
		} else if(event.button === 1) {
			event.preventDefault()
			SetOrigin(res.x, res.y)
		}
	}

	const HandleTouchStart = (event: any) => {
		if(!isMobile) return

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

    const SetDrawType = (type: DrawType) => {
        switch (type) {
            case DrawType.TO_ORIGIN:
                setLinesToOrigin(true)
                break
            case DrawType.DAISY_CHAIN:
                setLinesToOrigin(false)
                break
            default:
                break
        }
    }

    const SetSortType = (type: SortType) => {
        setType(type)
    }

    const Sort = ():number[] => {
        switch (sortType.current) {
            case SortType.INSERSTION_SORT:
                return InsertionSort(dists.current)
            case SortType.BUBBLE_SORT:
                return BubbleSort(dists.current)
            case SortType.SELECTION_SORT:
                return SelectionSort(dists.current)
            default:
                return []
        }
    }

    useEffect(() => {
		// window.addEventListener('mousedown', HandleMouseClick)
		// window.addEventListener('touchstart', HandleTouchStart)

		

		// return () => {
		// 	window.removeEventListener('mousedown', HandleMouseClick)
		// 	window.removeEventListener('touchstart', HandleTouchStart)
		// }

        if(placementArea && placementArea.current) {
            placementArea.current.addEventListener('mousedown', HandleMouseClick)
            placementArea.current.addEventListener('touchstart', HandleTouchStart)

            ResetOrigin()

            return () => {
                placementArea.current?.removeEventListener('mousedown', HandleMouseClick)
                placementArea.current?.removeEventListener('touchstart', HandleTouchStart)
            }
        }
	}, [placementArea.current])

	useEffect(() => {
		if(origin) FindClosest(positions, origin)
	}, [origin, positions])

	useEffect(() => {
		setOrder(Sort())
	}, [origin, positions, distances, linesToOrigin])

    return (
        <DataContext.Provider value={{
            positions,
            origin,
            distances,
            order,
            placementArea,
            type,
            Clear,
            GetCoordString,
            GetRelativeDistance,
            SetDrawType,
            SetSortType,
            setUseFastDistance
        }}>
            {props.children}
        </DataContext.Provider>
    )
}