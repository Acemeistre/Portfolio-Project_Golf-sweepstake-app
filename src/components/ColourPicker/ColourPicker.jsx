import { useState } from 'react'
import './ColourPicker.css'

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
        title="Choose your colour"
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