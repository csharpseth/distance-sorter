import { useState, useEffect, useContext } from 'react';
import './App.css';
import FooterComponent from './components/FooterComponent';
import HeaderComponent from './components/HeaderComponent';
import { DropDownMenu } from './components/InputComponents';
import { DataContext } from './contexts/DataContext';
import { ThemeContext } from './contexts/ThemeContext';
import { GetSortingTypeData, SortTypeData } from './helpers/SortingTypeData';
import { AcknowledgementType, DrawType, SortType } from './ts/enums';

function App() {
	const [sortData, setSortData] = useState<SortTypeData>()

	const { darkMode, isMobile } = useContext(ThemeContext)
	const {
		positions,
		origin,
		order,
		placementArea,
		Clear,
		GetCoordString,
		GetRelativeDistance,
		SetDrawType,
		SetSortType,
		setUseFastDistance
	} = useContext(DataContext)
	
	function GetPointColorString(val: number):string {
		return `rgba(${Math.round(GetRelativeDistance(val) * 255 + 50)}, ${Math.round((1 - GetRelativeDistance(val)) * 190 + 20)}, 0, 1)`
	}

	useEffect(() => {
		setSortData(GetSortingTypeData(SortType.INSERSTION_SORT))
	}, [])

	return (
		<>
		<div className="App" id={darkMode ? 'darkBackground':''}>
			
			<HeaderComponent />

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
				className='placementArea FadeIn'
				id={darkMode ? 'placementAreaDark':''}
				ref={placementArea}
			>
				<div className='interactionRegion' >
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
								backgroundColor: GetPointColorString(index)
							}}>
							{ind}
							</div>
				}):''}

				<svg>
					{order && positions ? order.map((val: number, index: number) => 
						<polyline
							key={val}
							style={{
								stroke: GetPointColorString(val)
							}}
							points={GetCoordString(index, index-1)}
						/>
					): ''}
				</svg>
			</div>

			<div className='options'>
				<DropDownMenu
				title='Line Draw Type'
				options={Object.values(DrawType)}
				onChange={(val: string) => {
					SetDrawType(val)
				}} />
				<DropDownMenu
				title='Sorting Method'
				options={Object.values(SortType)}
				onChange={(val: string) => {
					SetSortType(val)
					setSortData(GetSortingTypeData(val))
				}} />
				<DropDownMenu
				title='Use Fast Distance'
				options={Object.values(AcknowledgementType)}
				onChange={(val: string) => {
					setUseFastDistance(val === 'Yes')
				}} />
			</div>
			
			{sortData ?
			<div className="aboutSection sortDataSection" id={darkMode ? 'darkModeFont':''}>
			<h2>{sortData.title}</h2>
			<p>{sortData.body}</p>
			</div>	
			:''}	

			<div className="aboutSection" id={darkMode ? 'darkModeFont':''}>
			<h2>About This Page</h2>
			<p>
				This is my demonstration of different sorting algorithm implementations. You can choose between various sorting algorithms to visualize the closest points to a specified origin. You simply plot as many points as you want, then select a sorting algorithm to quickly find and visualize the nearest points. This site offers a convenient way for you to learn and understand how different sorting algorithms work in finding the closest points to an origin. You can find the source code <a target='_blank' href="https://github.com/csharpseth/react-point-distance-sorter">Here</a>.
			</p>
			</div>

		</div>
		<FooterComponent />
		</>
	);
}

export default App;
