import React, { useState, useEffect, useRef } from 'react';
import '../styles/InputStyles.css';

function Checkbox(props: any) {
    
    const { title, value, darkMode, mobile, onChange } = props

    const [ internalValue, setInternalValue ] = useState<boolean>(false)

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

    const { className, darkMode, id, value, onChange } = props

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

export {
    Checkbox,
    ToggleButton
}