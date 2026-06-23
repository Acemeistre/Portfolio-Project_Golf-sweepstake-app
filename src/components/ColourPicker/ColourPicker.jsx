import { useState } from 'react'
import './ColourPicker.css'

// set a palette of colours whos use remains constant throughout the app 
const COLOURS = [
  '#F37D78',
  '#F88AB0',
  '#E68FEF',
  '#BE8BF3',
  '#9896F8',
  '#8FC8EF',
  '#8BF3F2',
  '#96F8C9',
  '#98EF8F',
  '#C0F38B',
  '#F6F896',
  '#EFB68F', 
]

// set a funtion signature that recives: currentColour, taken colours and onColour change from both ParticipantEntry.jsx 
// and Stage3_Scores.jsx and its disabled prop also from ParticipantEntry 
function ColourPicker({ currentColour, takenColours, onColourChange, disabled }) {
  // set isOpen state to false upon ColourPicker mount
  const [isOpen, setIsOpen] = useState(false)
  // set a function to handle colour selection that uses colour as its argument
  const handleColourSelect = (colour) => {
    // use the .includes() method to pass over the array of colours in takenColours, exiting if colour is already taken by another participant
    if (takenColours.includes(colour)) return
    // set the state with our new chosen colour
    onColourChange(colour)
    // close the colour palette
    setIsOpen(false)
  }

  return (
    <div className="colour-picker">
      <div
        className={`colour-picker__swatch ${disabled ? 'colour-picker__swatch--disabled' : ''}`}
        style={{ backgroundColor: currentColour }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        role="button"
        aria-label="Choose your colour"
        aria-expanded={isOpen}
        title="choose the colour you'd like to represent all your drawn players"
        >

        {!disabled && <span className="colour-picker__arrow">▼</span>}
      </div>
      {isOpen && (
        <div className="colour-picker__dropdown">
          {COLOURS.map(colour => (
            <div
              key={colour}
              className={`colour-picker__option ${takenColours.includes(colour) ? 'colour-picker__option--taken' : ''}`}
              style={{ backgroundColor: colour }}
              onClick={() => handleColourSelect(colour)}
              role="button"
              aria-label={`Select colour ${colour}`}
              aria-disabled={takenColours.includes(colour)}
              title="Choose your colour"
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ColourPicker