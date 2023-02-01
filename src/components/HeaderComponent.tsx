import { useContext } from 'react';

import { ToggleButton } from '../components/InputComponents';
import { ThemeContext } from '../contexts/ThemeContext';

export default function HeaderComponent(props: any) {

    const { darkMode, ToggleDarkMode } = useContext(ThemeContext)

    return (
        <header id={darkMode ? 'dark':''}>
            <img src="https://csharpseth.github.io/react-point-distance-sorter/logo.png" alt="" />
            <h1>Distance Sorter 9000</h1>
            <div className='darkModeToggle'>
            <ToggleButton
                darkMode={darkMode}
                value={darkMode}
                onChange={(val: boolean) => ToggleDarkMode(val)}
            />
            <span>{darkMode ? 'Dark':'Light'}</span>
            </div>
        </header>
    )
}