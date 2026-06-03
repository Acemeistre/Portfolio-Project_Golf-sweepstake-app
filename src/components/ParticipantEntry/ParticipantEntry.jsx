import {useState} from "react";
import "./ParticipantEntry.css";
import ColourPicker from "../ColourPicker/ColourPicker";
import { Check, Pencil, X } from 'lucide-react';

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

function ParticipantEntry({ participants, onParticipantsChange}) {
    const addParticipant = () => {
        if (participants.length >=8 ) return;
        const takenColours = participants.map(p => p.colour)
        const availableColours = COLOURS.find(c => !takenColours.includes(c))
        const newParticipant = {
            id: Date.now(),
            name: '',
            colour: availableColours,
            isConfirmed: false
        }
        onParticipantsChange([...participants, newParticipant])
    }
    
    const removeParticipant = (id) => {
        if (participants.length <= 2) return
    
    //Check if there's alread an empty unconfirmed row.    
    const updated = participants.filter(p => p.id !== id)

    // If no empty rows exist and we're under 8, add one back
    const hasEmptyRow = updated.some(p => !p.isConfirmed && p.name.trim() === '')

    if (!hasEmptyRow && updated.length < 8) {
        const takenColours = updated.map(p => p.colour)
        const availableColour = COLOURS.find(c => !takenColours.includes(c))
        const newParticipant = {
            id: Date.now(),
            name: '',
            colour: availableColour,
            isConfirmed: false
        }
        onParticipantsChange([...updated, newParticipant])
    } else {
        onParticipantsChange(updated)
    }
    }
    
    const updateName = (id, name) => {
        onParticipantsChange(participants.map(p => p.id === id ? {...p, name} : p))
    }

    const confirmParticipant = (id) => {
        const participant = participants.find(p => p.id === id)
        if (!participant.name.trim()) return

        //Check for duplicate names
        const isDuplicate = participants.some(p => 
            p.id !== id &&
            p.isConfirmed &&
            p.name.trim()=== participant.name.trim()
        )
        if (isDuplicate) {
            alert('This name is already taken - please choose a different name.')
            return
        }

        const updated = participants.map(p => p.id === id ? {...p, isConfirmed: true } : p  
        )

        // Add new row if under 8 and all current rows are confirmed
        const confirmedCount = updated.filter(p => p.isConfirmed).length

        if (confirmedCount >= 2 && participants.length < 8) {
            const takenColours = updated.map(p => p.colour)
            const availableColour = COLOURS.find(c => !takenColours.includes(c))
            const newParticipant = {
                id: Date.now(),
                name: '',
                colour: availableColour,
                isConfirmed: false
            }
            onParticipantsChange([...updated, newParticipant])
        } else {
            onParticipantsChange(updated)
        }
    }

    const editParticipant = (id) => {

        // Remove any trailing unconfirmed empty rows first
        const filtered = participants.filter(p => p.id === id || p.isConfirmed || p.name.trim() !== ''
        )
        onParticipantsChange(filtered.map(p => p.id === id ? {...p, isConfirmed: false } : p
        ))
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
                            placeholder="pick your theme colour that tracks your player's progress throughout the app's experience"
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
                            >
                                <Check size={16} />
                            </button>
                            )}
                            <button 
                                className="participant-entry__btn participant-entry__btn--edit"
                                onClick={() => editParticipant(participant.id)}
                            >
                                <Pencil size={16} />
                            </button>
                            <button 
                                className="participant-entry__btn participant-entry__btn--remove"
                                onClick={() => removeParticipant(participant.id)}
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