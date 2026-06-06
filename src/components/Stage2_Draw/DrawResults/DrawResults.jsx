// Import React
import React from 'react'
// Import DrawResults.css
import './DrawResults.css'
// ----------

// Define the DrawResults component
// It receives: drawResults, participants, currentRound, players
function DrawResults({ drawResults, participants, currentRound, players }) {
    // Derived value: calculate total rounds from players and participants
    const totalRounds = players.length / participants.length; 
    // Return the column layout
    return (

        <div className='draw-results'>
            <div className='draw-results__header'>
                Round: {currentRound + 1} / {totalRounds}
            </div>
                {/* Map over participants and render each row */}
                {participants.map(participant => {
                
                // Get this participant's assigned players so far
                const assignedPlayers = drawResults[participant.id] || []

                // Current round player (TBD if not yet drawn)
                const currentPlayer = assignedPlayers[currentRound]

                // Previous round player
                const previousPlayer = assignedPlayers[currentRound - 1]
            return (
                <div
                    key={participant.id} 
                    className="draw-results__row"
                    style={{backgroundColor: participant.colour} }      
                >
                    <span className="draw-results__name">{participant.name}</span>
                    <span className="draw-results__current">{currentPlayer ? currentPlayer.name : ''}</span>
                    <span className="draw-results__previous">{previousPlayer ? previousPlayer.name : ''}</span>
                </div>
                
                )
            })}
        </div>       
    )
}

export default DrawResults