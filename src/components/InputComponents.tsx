import React, { useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/InputStyles.css';

function Checkbox(props: any) {
    const { title, value, mobile, onChange } = props

    const [ internalValue, setInternalValue ] = useState<boolean>(false)

    const { darkMode } = useContext(ThemeContext)

    function OnClick() {
        if(onChange) {
            if(value === undefined) {
                onChange(!internalValue)
            } else {
                onChange(!value)
            }
        }
        if(value === undefined) {
            setInternalValue(!internalValue)
        } else {
            setInternalValue(false)
        }
    }

	return (
        <div className='input-container'>
            <button className='checkbox' id={darkMode?'checkboxDark':''} onClick={OnClick}>
                {internalValue || value ? <span className='check'>{mobile?'X':'✔'}</span>:''}
                <div className={darkMode?'checkbox-background checkbox-backgroundDark':'checkbox-background'} id={internalValue || value?'checkbox-checked':''} />
            </button>
            <span className='checkbox-title' id={darkMode?'darkModeFont':''}>{title}</span>
        </div>
	)
}

function ToggleButton(props: any) {
    const [toggle, setToggle] = useState<boolean>(false)

    const { className, id, value, onChange } = props

    const { darkMode } = useContext(ThemeContext)


    function Toggle() {

        if(onChange) {
            if(value === undefined) {
                onChange(!toggle)
                setToggle(!toggle)
            } else {
                onChange(!value)
            }
        }

        if(value === undefined) {
            setToggle(!toggle)
        }
    }

    return (
        <div className={className} id={id} >
            <div className={darkMode ? 'toggleButton toggleButtonDark' : 'toggleButton'} onClick={Toggle}>
                <div className='toggleButtonIndicator' id={toggle || value ? 'toggleOn' : ''}></div>
            </div>
        </div>
    );
}

function DropDownMenu(props: any) {
    const { value, title, options, onChange } = props

    const { darkMode } = useContext(ThemeContext)

    const [menuOpen, setMenuOpen] = useState(false)
    const [internalValue, setInternalValue] = useState<string>(options[0])

    function SetSelection(val: string) {
        if(onChange) onChange(val)
        if(value === undefined) setInternalValue(val)

        setMenuOpen(false)
    }

    return (
        <div className='dropDownMenuField' id={darkMode ? 'darkModeFont' : ''}>
            <h3>{title}</h3>
            
            <div className='dropDownFieldContainer'>
            <div className={menuOpen ? 'dropDownMenu dropDownMenuOpen' : 'dropDownMenu dropDownMenuClose'} id={darkMode ? 'darkDropDownMenu' : ''}>
                {options.map((opt: string, index: number) => <span key={index} className='selectionElement NoSelect' id={darkMode ? 'dark' : ''} onClick={() => SetSelection(opt)}>{opt}</span>)}
            </div>
            <span className='selectionText NoSelect' id={darkMode ? 'darkModeFont' : ''}>{value ? value : internalValue}</span>
            <span className={menuOpen ? 'dropDownIcon NoSelect dropDownIconOpen' : 'dropDownIcon NoSelect'} id={darkMode ? 'darkDropDownIcon':''}>^</span>
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                onBlur={() => setTimeout(() => setMenuOpen(false), 50)}
                className='dropDownMenuFieldBackground'
                id={darkMode ? 'darkFieldBackground' : ''}
            />
            </div>
        </div>
    );
}

export {
    Checkbox,
    ToggleButton,
    DropDownMenu
}