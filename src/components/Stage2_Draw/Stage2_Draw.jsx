// Import React and useState
import { useEffect, useState } from 'react';
import './Stage2_Draw.css';

// Import the three column components
import PlayerQueue from './PlayerQueue/PlayerQueue';
import Spinner from './Spinner/Spinner';
import DrawResults from './DrawResults/DrawResults';


// Define the Stage2_Draw component
// It recieves: selectedTournament, tournament, participants, players, onBack, onComplete, onReset
function Draw({selectedTournament, tournament, participants, players, onBack, onReset, onComplete}) {

  // State: which group are we currently drawing for (start at 0)
  // State: the draw results so far (an object or array mapping participants to their players)
  // State: which participants are still available to spin for the current group
    const [currentRound, setCurrentRound] = useState(0);
    const [drawResults, setDrawResults] = useState({});
    const [availableParticipants, setAvailableParticipants] = useState(participants)



 // Derived value: calculate remainder and current round players
const remainder = players.length % participants.length

const currentRoundStart = remainder === 0
    ? currentRound * participants.length
    : currentRound === 0
        ? 0
        : remainder + (currentRound - 1) * participants.length

const currentRoundEnd = remainder === 0
    ? (currentRound + 1) * participants.length
    : currentRound === 0
        ? remainder
        : remainder + currentRound * participants.length
    const currentRoundPlayers = players.slice(currentRoundStart, currentRoundEnd)

  //Derived value: fiter out the drawn players at the end of each spin from the player queue
  const drawnPlayers = Object.values(drawResults).flat()
  const remainingPlayers = players
    .map((p, index) => ({ ...p, originalIndex: index }))
    .filter(p => !drawnPlayers.find(dp => dp.name === p.name))

    console.log('remainingPlayers:', remainingPlayers);

  //Derived value: Track how many participants are left within the currentRound
  const playerIndex = participants.length - availableParticipants.length

  //Derived value: Tracks whether the draw has begun or not.
  const hasDrawStarted = Object.keys(drawResults).length > 0

  //Derived value: tracks when the draw has been completed
   const isDrawComplete = remainingPlayers.length === 0

  // Handler: what happens when a spin lands on a participant
  const handleSpin = (participant) => {
    if (participant) {
            console.log('playerIndex:', playerIndex)
            console.log('currentRoundPlayers:', currentRoundPlayers)
            console.log('assigning:', currentRoundPlayers[playerIndex])
            console.log('drawResults after update:', drawResults)
            console.log('spinning for participant:', participant)
            console.log('all participants:', participants)
        const updatedParticipants = availableParticipants.filter(p => p.id !== participant.id)
        
        setAvailableParticipants(updatedParticipants)
        setDrawResults(prev => ({
            ...prev,
            [participant.id]: [...(prev[participant.id] || []), currentRoundPlayers[playerIndex]]
        }))

if (playerIndex + 1 >= currentRoundPlayers.length) {
    setTimeout(() => {
        setDrawResults(prev => {
            const updated = { ...prev }
            participants.forEach(p => {
                if (!updated[p.id] || updated[p.id].length === 0) {
                    updated[p.id] = [{ name: '-', price: null }]
                }
            })
            return updated
        })
        setCurrentRound(prev => prev + 1)
        setAvailableParticipants(participants)
    }, 500)
}
  }
}

  // Handler: what happens when all rounds are done (trigger onComplete)
    const handleDrawComplete = () => {
        const totalRounds = players.length / participants.length
        if (currentRound >= totalRounds) {
            onComplete()
        }
    }

  //Handler: what happens if the draw is already live
    const handleBack = () => {
      if (hasDrawStarted) {
      const confirm = window.confirm("Are you certain? Going back will lose your draw progress.") 
      if (!confirm) return
      } 
      onBack()
    }

  //Handler: what happens once all rounds have been completed?
    const handleDrawContinue = () => {
      const confirm = window.confirm("Are you certain you wish to complete the draw and continue?")
      if (!confirm) return
      onComplete()
    }

  //Handler: what needs to happens to the Draw if a reset is clicked?
    const handleResetDraw = () => {
      if (hasDrawStarted) {
      const confirm = window.confirm("Are you certain? This will restart the draw from the beginning")
      if (!confirm) return
      }
      setCurrentRound(0);
      setDrawResults({});
      setAvailableParticipants(participants);
    }

  // Return the three-column layout

  // Column 1 gets: the full player list, current round info
  // Column 2 gets: current round's players, available participants, onSpin handler
  // Column 3 gets: draw results, participants
  return (
    <div className="stage2-layout">
      <div className='stage2-columns'>
        <PlayerQueue
        selectedTournament={selectedTournament}
        players={remainingPlayers}
        currentRoundPlayers={currentRoundPlayers}
        participants={participants}
        currentRound={currentRound}
        remainder={remainder}
        tournament={tournament}
        />
        <Spinner
        availableParticipants={availableParticipants}
        handleSpin={handleSpin}
        onComplete={handleDrawContinue}
        isDrawComplete={isDrawComplete}
        />
        <DrawResults
        drawResults={drawResults}
        participants={participants}
        currentRound={currentRound}
        players={players}
        
        />
        </div>
        <div className="stage2-buttons">
            <button 
                className="back-btn"
                onClick={handleBack}
            >
                Back
            </button>
                        <button 
                className="stage2-continue-btn"
                onClick={handleDrawContinue}
                disabled={!isDrawComplete}
            >
                Continue
            </button>
                        <button 
                className="restart-btn"
                onClick={handleResetDraw}
            >
                Restart
            </button>
        </div>
    </div>
    
  )
}

// Export default
export default Draw;