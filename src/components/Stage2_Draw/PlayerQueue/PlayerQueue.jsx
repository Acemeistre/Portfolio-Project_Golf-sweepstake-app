// Import React
import React from 'react';
// Import PlayerQueue.css
import './PlayerQueue.css';

// Define the PlayerQueue component
function PlayerQueue({selectedTournament, remainder, players, currentRoundPlayers, participants, currentRound}) {
// Derived value: calculate round size from players and participants
const roundSize = Math.ceil(players.length / participants.length);

// Return the column layout
return (   
    <div className="player-queue">

        {/*Subheading: selected tournament name*/}
        <h2 className="player-queue__heading">{selectedTournament}</h2>

        {/* Scrollable list container */}
        <div className="player-queue__scroll-list">
    
        {/* Map over players and render each one */}
        {players.map((player, index) => {

            // Which round does this player belong to?
            const playerRound = index < remainder ? 1 : Math.floor((index - remainder) / participants.length) + 2

            // Is this player in the current round?
            const isCurrentRound = index < remainder ? currentRound === 0 : Math.floor((index - remainder) / participants.length) + 1 === currentRound

            // Is this the next player to be drawn?
            const isNextPlayer = player === currentRoundPlayers[0]

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