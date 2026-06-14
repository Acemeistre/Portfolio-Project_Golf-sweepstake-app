// Import DrawResults.css
import './DrawResults.css'

// Define the DrawResults component
// It receives: drawResults, participants, currentRound, players
function DrawResults({ drawResults, participants, currentRound, players }) {
    
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
            
            // Get this participant's assigned players so far (empty array if none yet)
            const assignedPlayers = drawResults[participant.id] || []
                
            // Check if this participant has been drawn in the current round
            const hasCurrentRoundPlayer = assignedPlayers.length > currentRound
                
            // Current player: show their most recently assigned player if drawn this round,
            // otherwise show nothing
            const currentPlayer = hasCurrentRoundPlayer 
            ? assignedPlayers[assignedPlayers.length - 1] 
            : null
                
            // If drawn this round and has a previous player → show second to last assigned player
            // If not yet drawn this round but has players → show their most recent player in previous column
            // Otherwise → show nothing (start of draw or first round) 
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