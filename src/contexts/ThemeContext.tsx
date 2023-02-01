import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({} as any)

export function ThemeProvider(props: any) {

    const [darkMode, setDarkMode] = useState<boolean>(false)
	const [width, setWidth] = useState<number>(window.innerWidth)
	const [isMobile, setIsMobile] = useState<boolean>(width <= 768)

    function ToggleDarkMode(active: boolean) {
        setDarkMode(active)
    }

    useEffect(() => {
        function HandleWindowResize() {
            setWidth(window.innerWidth)
            setIsMobile(width <= 768)
        }

        window.addEventListener('resize', HandleWindowResize)
        return () => {
			window.removeEventListener('resize', HandleWindowResize)
        }

    }, [])

    return (
        <ThemeContext.Provider value={{ darkMode, isMobile, ToggleDarkMode }}>
            {props.children}
        </ThemeContext.Provider>
    );
}