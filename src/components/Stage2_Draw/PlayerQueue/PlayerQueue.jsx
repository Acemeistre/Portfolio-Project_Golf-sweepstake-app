// Import React
import React from 'react';
// Import PlayerQueue.css
import './PlayerQueue.css';

// Define the PlayerQueue component
function PlayerQueue({tournament, playerIndex, remainder, players, currentRoundPlayers, participants, currentRound}) {

// Derived value: calculate round size from players and participants
const roundSize = Math.ceil(players.length / participants.length);

// Return the column layout
return (   
    <div className="player-queue">

        {/* Subheading: selected tournament name */}
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
                <span className="player-queue__odds">Odds</span>
            </div>
            {players.map((player, index) => {

            const playerRound = remainder === 0
                ? Math.floor(player.originalIndex / participants.length) + 1
                : player.originalIndex < remainder 
                ? 1 
                : Math.floor((player.originalIndex - remainder) / participants.length) + 2

            const isCurrentRound = remainder === 0
                ? Math.floor(player.originalIndex / participants.length) === currentRound
                : player.originalIndex < remainder 
                ? currentRound === 0 
                : Math.floor((player.originalIndex - remainder) / participants.length) + 1 === currentRound
                
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
                        <span className="player-queue__odds">{player.price}</span>
                    </div>
                )
            })}
        </div>
    </div>
)
}

// Export default
export default PlayerQueue;