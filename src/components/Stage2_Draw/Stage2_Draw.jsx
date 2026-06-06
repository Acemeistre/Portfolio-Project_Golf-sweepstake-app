// Import React and useState
import { useEffect, useState } from 'react';
import './Stage2_Draw.css';

// Import the three column components
import PlayerQueue from './PlayerQueue/PlayerQueue';
import Spinner from './Spinner/Spinner';
import DrawResults from './DrawResults/DrawResults';


// Define the Stage2_Draw component
function Draw({selectedTournament, participants, players, onBack, onComplete}) {
// It recieves: participants, players, onBack, onComplete
    const [currentRound, setCurrentRound] = useState(0);
    const [drawResults, setDrawResults] = useState({});
    const [availableParticipants, setAvailableParticipants] = useState(participants)

useEffect(() => {
    handleCurrentRound()
}, [availableParticipants])

  // Derived value: calculate round size (total players divided by number of participants)
    const roundSize = players.length / participants.length;

  // Derived value: work out which players belong to the current round
    const currentRoundPlayers = players.slice(currentRound * roundSize, (currentRound + 1) * roundSize);

  // Handler: what happens when a spin lands on a participant
    const handleSpin = (participant) => {
        if (participant) {
            const updatedParticipants = (availableParticipants.filter(p => p.id !== participant.id)) 
            
            setAvailableParticipants(updatedParticipants)
            setDrawResults(prev => ({
                ...prev,
                [participant.id]: [...(prev[participant.id] || []), currentRoundPlayers[0]]
            }))
        }
     }

  // Handler: what happens when the current round is fully drawn (advance to next round)
    const handleCurrentRound = () => {
        if (availableParticipants.length === 0) {
            setCurrentRound(prev => prev + 1)
            setAvailableParticipants(participants)
        }}

  // Handler: what happens when all rounds are done (trigger onComplete)
    const handleDrawComplete = () => {
        const totalRounds = players.length / participants.length
        if (currentRound >= totalRounds) {
            onComplete()
        }
    }

  // Return the three-column layout

  // Column 1 gets: the full player list, current round info
  // Column 2 gets: current round's players, available participants, onSpin handler
  // Column 3 gets: draw results, participants
  return (
    <div className="stage2-layout">
        <PlayerQueue
        selectedTournament={selectedTournament}
        players={players}
        currentRoundPlayers={currentRoundPlayers}
        participants={participants}
        currentRound={currentRound}
        />
        <Spinner
        availableParticipants={availableParticipants}
        handleSpin={handleSpin}
        handleCurrentRound={handleCurrentRound}
        />
        <DrawResults
        drawResults={drawResults}
        participants={participants}
        />
    </div>
  )
}

// Export default
export default Draw;