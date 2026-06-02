import {useState} from "react";
import "./ParticipantEntry.css";
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
        onParticipantsChange(participants.filter(p => p.id !== id))
    }
    
    const updateName = (id, name) => {
        onParticipantsChange(participants.map(p => p.id === id ? {...p, name} : p))
    }

    const confirmParticipant = (id) => {
        const participant = participants.find(p => p.id === id)
        if (!participant.name.trim()) return
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
                Enter Participants:
            </label>
            <div className="participant-entry__list">
                {participants.map(participant => (
                    <div key={participant.id} 
                    className={`participant-entry__row ${participant.isConfirmed ? 'participant-entry__row--confirmed' : ''}`}>
                        <div 
                            className="participant-entry__colour-swatch" 
                            style={{backgroundColor: participant.colour}} 
                            />
                            <input
                                className="participant-entry__input"
                                type="text"
                                placeholder="Enter name..."
                                value={participant.name}
                                onChange={(e) => updateName(participant.id, e.target.value)}
                                disabled={participant.isConfirmed}
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