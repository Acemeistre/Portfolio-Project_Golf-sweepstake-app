// Import React
import React from 'react';
// Import PlayerQueue.css
import './PlayerQueue.css';

// Define the PlayerQueue component
function PlayerQueue({selectedTournament, players, currentGroupPlayers, participants, currentGroup}) {
// Derived value: calculate group size from players and participants
const groupSize = players.length / participants.length;

// Return the column layout
return (   
    <div className="player-queue">

        {/*Subheading: selected tournament name*/}
        <h2 className="player-queue__heading">{selectedTournament}</h2>

        {/* Scrollable list container */}
        <div className="player-queue__scroll-list">
    
        {/* Map over players and render each one */}
        {players.map((player, index) => {

            // Which group does this player belong to?
            const playerGroup = Math.floor(index / groupSize) + 1

            // Is this player in the current group?
            const isCurrentGroup = Math.floor(index / groupSize) === currentGroup

            // Is this the next player to be drawn?
            const isNextPlayer = player === currentGroupPlayers[0]

                return (
                    <div
                        key={player.name}
                        className={`player-queue__row 
                            ${isCurrentGroup ? 'player-queue__row--current-group' : ''} 
                            ${isNextPlayer ? 'player-queue__row--next' : ''}`}
                    >
                        <span className="player-queue__group">{playerGroup}</span>
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