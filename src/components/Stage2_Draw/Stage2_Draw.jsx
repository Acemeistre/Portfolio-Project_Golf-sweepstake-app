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
    const [currentGroup, setCurrentGroup] = useState(0);
    const [drawResults, setDrawResults] = useState({});
    const [availableParticipants, setAvailableParticipants] = useState(participants)

useEffect(() => {
    handleCurrentGroup()
}, [availableParticipants])

  // Derived value: calculate group size (total players divided by number of participants)
    const groupSize = players.length / participants.length;

  // Derived value: work out which players belong to the current group
    const currentGroupPlayers = players.slice(currentGroup * groupSize, (currentGroup + 1) * groupSize);

  // Handler: what happens when a spin lands on a participant
    const handleSpin = (participant) => {
        if (participant) {
            const updatedParticipants = (availableParticipants.filter(p => p.id !== participant.id)) 
            
            setAvailableParticipants(updatedParticipants)
            setDrawResults(prev => ({
                ...prev,
                [participant.id]: [...(prev[participant.id] || []), currentGroupPlayers[0]]
            }))
        }
     }

  // Handler: what happens when the current group is fully drawn (advance to next group)
    const handleCurrentGroup = () => {
        if (availableParticipants.length === 0) {
            setCurrentGroup(prev => prev + 1)
            setAvailableParticipants(participants)
        }}

  // Handler: what happens when all groups are done (trigger onComplete)
    const handleDrawComplete = () => {
        const totalGroups = players.length / participants.length
        if (currentGroup >= totalGroups) {
            onComplete()
        }
    }

  // Return the three-column layout

  // Column 1 gets: the full player list, current group info
  // Column 2 gets: current group's players, available participants, onSpin handler
  // Column 3 gets: draw results, participants
  return (
    <div className="stage2-layout">
        <PlayerQueue
        selectedTournament={selectedTournament}
        players={players}
        currentGroupPlayers={currentGroupPlayers}
        participants={participants}
        currentGroup={currentGroup}
        />
        <Spinner
        currentGroupPlayers={currentGroupPlayers}
        availableParticipants={availableParticipants}
        handleSpin={handleSpin}
        handleCurrentGroup={handleCurrentGroup}
        />
        <DrawResults
        drawResults={drawResults}
        participants={participants}
        />
    </div>
  )
}
  // Column 1 gets: the full player list, current group info
  // Column 2 gets: current group's players, available participants, onSpin handler
  // Column 3 gets: draw results, participants
        
// Export default
export default Draw;