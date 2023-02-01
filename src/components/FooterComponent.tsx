import { useContext } from "react";

import { ThemeContext } from "../contexts/ThemeContext";

export default function FooterComponent(props: any) {

	const { darkMode } = useContext(ThemeContext)

    return (
        <footer id={darkMode ? 'dark':''}>
			<div className='additionalInfo'>
				<a target='_blank' href="https://www.linkedin.com/in/sethhamm/">Linkedin</a>
				<a target='_blank' href="https://github.com/csharpseth">GitHub</a>
				<a target='_blank' href="https://twitter.com/sethiesparkles">Twitter</a>
				<a target='_blank' href="https://www.youtube.com/@codewithseth">YouTube</a>
			</div>
			<span>Distance Sorter 9000 <b>&copy;</b> Seth Hamm 2023</span>
		</footer>
    )
}