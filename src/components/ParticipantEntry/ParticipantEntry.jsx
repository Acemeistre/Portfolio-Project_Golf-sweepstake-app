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
        onParticipantsChange(participants.filter(p => p.id !== id))
    }
    
    const updateName = (id, name) => {
        onParticipantsChange(participants.map(p => p.id === id ? {...p, name} : p))
    }

    return (
        <div className="participant-entry">
            <label className="participant-entry__label">
                Enter Participants:
            </label>
            <div className="participant-entry__list">
                {participants.map(participant => (
                    <div key={participant.id} className="participant-entry__row">
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
                            />
                            <button className="participant-entry__btn participant-entry__btn--confirm">
                                <Check size={16} />
                            </button>
                            <button 
                                className="participant-entry__btn participant-entry__btn--edit">
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
                {participants.length < 8 && (
                    <button 
                    className="participant-entry__add-btn"
                    onClick={addParticipant}
                    >
                       + Add Participant
                    </button>
                )}    
            </div>
    );
}

export default ParticipantEntry;