// Import React
import React from 'react'
// Import DrawResults.css
import './DrawResults.css'
// ----------

// Define the DrawResults component
// It receives: drawResults, participants, currentRound, players
function DrawResults({ drawResults, participants, currentRound, players, remainder }) {
    // Derived value: calculate total rounds from players and participants
    const totalRounds = Math.ceil(players.length / participants.length); 
    // Return the column layout
    return (

        <div className='draw-results'>
            <div className='draw-results__header'>
                Round: {currentRound + 1} / {totalRounds}
            </div>
                <div className='draw-results__table'>
        {/* Column headers */}
        <div className='draw-results__header-row'>
            <span className='draw-results__table-header__participant'>Entry</span>
            <span className='draw-results__table-header__current'>Current</span>
            <span className='draw-results__table-header__previous'>Previous</span>
        </div>
        
                {/* Map over participants and render each row */}
               
                {participants.map(participant => {
                console.log('currentRound:', currentRound)
                const assignedPlayers = drawResults[participant.id] || []
                
                // Get this participant's assigned players so far
                const completedRounds = currentRound  
                // rounds that have finished
                const hasCurrentRoundPlayer = assignedPlayers.length > completedRounds

                 const currentPlayer = hasCurrentRoundPlayer 
                ? assignedPlayers[assignedPlayers.length - 1] 
                : null

                const previousPlayer = assignedPlayers.length > 0 && !hasCurrentRoundPlayer
                ? assignedPlayers[assignedPlayers.length - 1]
                : assignedPlayers.length > 1 && hasCurrentRoundPlayer
                ? assignedPlayers[assignedPlayers.length - 2]
                : null

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

        </div>       
    )
}

export default DrawResults