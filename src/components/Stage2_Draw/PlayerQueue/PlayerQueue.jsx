// Import PlayerQueue.css
import './PlayerQueue.css';

// PlayerQueue: receives tournament, players, participants and draw state to render the scrollable player list
function PlayerQueue({tournament, playerIndex, remainder, players, currentRoundPlayers, participants, currentRound, sortOption}) {

// Return the column layout
return (   
    <div className="player-queue">

        {/* Subheading: Tournament card: displays name, date and location with tournament colour background */}
        <div 
            className="player-queue__heading"
            style={{ backgroundColor: tournament.colour }}
        >
            <span className="player-queue__heading-name">{tournament.name}</span>
            <span className="player-queue__heading-date">{tournament.date}</span>
            <span className="player-queue__heading-location">{tournament.location}</span>
        </div>

        {/* Scrollable list container */}
        <div className="player-queue__scroll-list">
            <div className="player-queue__header-row">
                <span className="player-queue__round">Round</span>
                <span className="player-queue__name">Player</span>
                <span className="player-queue__odds">{sortOption === 'Ranking' ? 'Rank' : 'Odds'}</span>
            </div>
            {players.map((player) => {

            // Calculate which round this player belongs to:
            // If no remainder → divide original position by participants, round down, add 1 for human-readable round number
            // If player is in remainder group → they're always in round 1
            // Otherwise → skip past remainder players, divide by participants, add 2 (1 for zero-index, 1 because round 1 is taken by remainder)
            const playerRound = remainder === 0
                ? Math.floor(player.originalIndex / participants.length) + 1
                : player.originalIndex < remainder 
                ? 1 
                : Math.floor((player.originalIndex - remainder) / participants.length) + 2
            
            // Check if this player is in the round currently being drawn:
            // Same logic as playerRound but returns true/false instead of a round number    
            const isCurrentRound = remainder === 0
                ? Math.floor(player.originalIndex / participants.length) === currentRound
                : player.originalIndex < remainder 
                ? currentRound === 0 
                : Math.floor((player.originalIndex - remainder) / participants.length) + 1 === currentRound
                
            // Check if this player is the next to be drawn in the current round    
            const isNextPlayer = player.name === currentRoundPlayers[playerIndex]?.name
                
                return (
                    <div
                        key={player.name}
                        className={`player-queue__row 
                            ${isCurrentRound ? 'player-queue__row--current-round' : ''} 
                            ${isNextPlayer ? 'player-queue__row--next' : ''}`}
                    >
                        <span className="player-queue__round">{playerRound}</span>
                        <span className="player-queue__name">{player.name}</span>
                        <span className="player-queue__rank-odds">{sortOption === 'Ranking' ? player.rank : player.price}</span>
                    </div>
                )
            })}
        </div>
    </div>
)
}

// Export default
export default PlayerQueue;