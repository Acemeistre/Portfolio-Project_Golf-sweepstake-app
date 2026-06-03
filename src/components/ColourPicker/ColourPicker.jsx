import { useState } from 'react'
import './ColourPicker.css'

const COLOURS = [
  '#008BFD',
  '#F7FF00',
  '#37CE00',
  '#8F00FD',
  '#FF4500',
  '#FF1493',
  '#00CED1',
  '#FF8C00',
]

function ColourPicker({ currentColour, takenColours, onColourChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleColourSelect = (colour) => {
    if (takenColours.includes(colour)) return
    onColourChange(colour)
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
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ColourPicker