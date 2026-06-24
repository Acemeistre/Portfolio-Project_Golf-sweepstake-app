import {useState} from "react";
import "./ParticipantEntry.css";
import ColourPicker from "../ColourPicker/ColourPicker";
import { Check, Pencil, X } from 'lucide-react';
import { COLOURS } from '../../data/colours.js'

// Define the ParticipantEntry function that receives: participants and onParticipantChange
function ParticipantEntry({ participants, onParticipantsChange }) {
    
    // set a function to remove participants, using id as its argument
    const removeParticipant = (id) => {
        // exit the function if there are 2 or fewer participants, as the draw requires a minimum of 2 to function
        if (participants.length <= 2) return
        // use the .filter() method on the participants array and save the new array 
        // (that does not include the id on the item that our argument id is equal to) to a const variable of updated.    
        const updated = participants.filter(p => p.id !== id)
        // add a check, using the .some method() to pass over rows that are not confirmed 
        // and use .trim() to clear whitespace to check if the item row is equal to an empty string.
        const hasEmptyRow = updated.some(p => !p.isConfirmed && p.name.trim() === '')
        // use an if statement to check there are no empty rows and our update array is less then 8 participant
        if (!hasEmptyRow && updated.length < 8) {
        // use the .map() method to collect the colour values from the participant item and save it to a const variable of takenColours
        const takenColours = updated.map(p => p.colour)
        // use the .find() method to return the first the item colours that are not taken using the .includes() method and save it to a const variable of availableColours
        const availableColour = COLOURS.find(c => !takenColours.includes(c))
        // create a new blank participant row to replace the removed one, 
        // ensuring there's always an empty row available for a new entry
        // set the baseline data for a new participant
        const newParticipant = {
            id: Date.now(),
            name: '',
            colour: availableColour,
            isConfirmed: false
        }
        // set the state to include both the updated and new participants
        onParticipantsChange([...updated, newParticipant])
        } else {
        // set the state for updated participants, when the const 'hasEmptyRow' is true
        onParticipantsChange(updated)
        }
    }
    
    // set a function to update names using id and name as arguments
    const updateName = (id, name) => {
        // update the use state by using the .map method() to return changes to the participants array,
        // by checking the condition of the item's id equals id (to check this is the item we want) 
        // and if yes then copy the results and add name else leave item untouched
        onParticipantsChange(participants.map(p => p.id === id ? {...p, name} : p))
    }

    // set a function to confirm names using id as its argument
    const confirmParticipant = (id) => {
        // use the .find() method to find each participant has an id and save it to a const variable of participant
        const participant = participants.find(p => p.id === id)
        // exit the function if there's no name after trimming whitespace
        if (!participant.name.trim()) return
        // Check for duplicate names, by using the .some() method on the participants array to return any items that:
        // do not have the same id, is already confirmed and have the same name after trimming whitespace and save it to a const variable of isDuplicate
        const isDuplicate = participants.some(p => 
            p.id !== id &&
            p.isConfirmed &&
            p.name.trim()=== participant.name.trim()
        )
        // use our isDuplicate variable to set an alert message if true, else return to exit the check
        if (isDuplicate) {
            alert('This name is already taken - please choose a different name.')
            return
        }
        // use the .map method() to return changes to the participants array,
        // by checking the condition of the item's id equals id (to check this is the item we want) 
        // and if yes then copy the results and set isConfirmed to true, saving the result to a const variable of updated, else leave item untouched
        const updated = participants.map(p => p.id === id ? {...p, isConfirmed: true } : p  
        )
        // use the .filter() method to make a new array of items where isConfirmed is true, using .length to track the number and save it to a const variable of confirmedCount
        const confirmedCount = updated.filter(p => p.isConfirmed).length
        // use our confirmedCount variable to check for a value equal to or greater than 2 and participants are less than 8
        if (confirmedCount >= 2 && participants.length < 8) {
        // use the .map() method to collect the colour values from the participant item and save it to a const variable of takenColours
        const takenColours = updated.map(p => p.colour)
        // use the .find() method to return the first the item colours that are not taken using the .includes() method and save it to a const variable of availableColours
        const availableColour = COLOURS.find(c => !takenColours.includes(c))
        // create a new blank participant row to replace the removed one, 
        // ensuring there's always an empty row available for a new entry
        // set the baseline data for a new participant
        const newParticipant = {
            id: Date.now(),
            name: '',
            colour: availableColour,
            isConfirmed: false
        }
        // set the state to include both the updated and new participants
            onParticipantsChange([...updated, newParticipant])
        } else {
        // set the state for updated participants, when there are fewer than 2 confirmed participants or we've already hit 8 total participants
            onParticipantsChange(updated)
        }
    }

    // set a function to edit participants using id as its argument
    const editParticipant = (id) => {
        // Remove any trailing unconfirmed empty rows first by:using the .filter() method on our participants array, keeping any participants that
        // is a participant being edited or if the participant is already confirmed or if the name is not equal to an empty string after trimmming whitespace
        const filtered = participants.filter(p => p.id === id || p.isConfirmed || p.name.trim() !== '')
        // safety check: prevents editParticipant from dropping below the minimum of 2 participant rows
        // use a ternary operator to check the condition of our filtered variable's length is more than or equal to 2, 
        // saving filtered to a const variable of safeList if true or returning our participants array if false
        const safeList = filtered.length >= 2 ? filtered : participants
        // set the state for onParticipantsChange using the .map() filter on our safeList variable to loop through every item that has a condition of id,
        // and returning the copying all the data of those items but setting is confirmed to false, else returning the item if false
        onParticipantsChange(safeList.map(p => p.id === id ? {...p, isConfirmed: false } : p))
    }

    return (
        <div className="participant-entry">
            <label className="participant-entry__label">
                Entries:
            </label>
            <div className="participant-entry__list">
                {participants.map(participant => (
                    <div key={participant.id} 
                    className={`participant-entry__row ${participant.isConfirmed ? 'participant-entry__row--confirmed' : ''}`}>
                       <ColourPicker className="participant-entry__colour-swatch"
                            currentColour={participant.colour}
                            takenColours={participants
                                .filter(p => p.id !== participant.id)
                                .map(p => p.colour)}
                            onColourChange={(newColour) => 
                                { onParticipantsChange(participants.map(p => 
                                    p.id === participant.id ? {...p, colour: newColour} : p
                                ))                
                            }}
                            disabled={participant.isConfirmed}
                                />
                            <input
                                className="participant-entry__input"
                                type="text"
                                placeholder="Enter name..."
                                value={participant.name}
                                onChange={(e) => updateName(participant.id, e.target.value)}
                                disabled={participant.isConfirmed}
                                maxLength={22}
                            />
                            {!participant.isConfirmed && (
                            <button className="participant-entry__btn participant-entry__btn--confirm"
                                onClick={() => confirmParticipant(participant.id)}
                                aria-label="Confirm participant"
                                title="Confirm your name before continuing"
                            >
                                <Check size={16} />
                            </button>
                            )}
                            <button 
                                className="participant-entry__btn participant-entry__btn--edit"
                                onClick={() => editParticipant(participant.id)}
                                aria-label="Edit participant"
                                title="Edit participant"
                            >
                                <Pencil size={16} />
                            </button>
                            <button 
                                className="participant-entry__btn participant-entry__btn--remove"
                                onClick={() => removeParticipant(participant.id)}
                                aria-label="Remove participant"
                                title="Remove Participant"
                            >
                                <X size={16} />
                            </button>    
                    </div>
                ))}
                </div>
            </div>
    );
}

export default ParticipantEntry;