// Import React and useState
import { useEffect, useState } from 'react';
import './Stage2_Draw.css';

// Import the three column components
import PlayerQueue from './PlayerQueue/PlayerQueue';
import Spinner from './Spinner/Spinner';
import DrawResults from './DrawResults/DrawResults';


// Define the Stage2_Draw component
// It recieves: participants, players, onBack, onComplete
function Draw({selectedTournament, participants, players, onBack, onComplete}) {

  // State: which group are we currently drawing for (start at 0)
  // State: the draw results so far (an object or array mapping participants to their players)
  // State: which participants are still available to spin for the current group
    const [currentRound, setCurrentRound] = useState(0);
    const [drawResults, setDrawResults] = useState({});
    const [availableParticipants, setAvailableParticipants] = useState(participants)



 // Derived value: calculate remainder and current round players
    const remainder = players.length % participants.length

    const currentRoundStart = currentRound === 0
        ? 0
        : remainder + (currentRound - 1) * participants.length

    const currentRoundEnd = currentRound === 0
        ? remainder
        : remainder + currentRound * participants.length

    const currentRoundPlayers = players.slice(currentRoundStart, currentRoundEnd)

  //Derived value: work out when all players drawn out to DrawResults equals the players.length  
  const totalAssigned = Object.values(drawResults).flat().length
  const isDrawComplete = totalAssigned === players.length

  //Derived value: Track how many participants are left within the currentRound
  const playerIndex = participants.length - availableParticipants.length

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
      const confirm = window.confirm("Are you certain? Going back will lose your draw progress.") 
      if (!confirm) return 
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
      const confirm = window.confirm("Are you certain? This will restart the draw from the beginning")
      if (!confirm) return
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
        <PlayerQueue
        selectedTournament={selectedTournament}
        players={players}
        currentRoundPlayers={currentRoundPlayers}
        participants={participants}
        currentRound={currentRound}
        remainder={remainder}
        />
        <Spinner
        availableParticipants={availableParticipants}
        handleSpin={handleSpin}
        
        />
        <DrawResults
        drawResults={drawResults}
        participants={participants}
        currentRound={currentRound}
        players={players}
        />
        <div className='stage2-buttons'>
        <div className="back-btn-wrapper">
          <button 
            className="back-btn"
            onClick={handleBack}
          >
            Back
          </button>
        </div>
        <div className="restart-btn-wrapper">
          <button 
            className="restart-btn"
            onClick={handleResetDraw}
          >
            Restart
          </button>
        </div>
        <div className="continue-btn-wrapper">
          <button 
            className={`continue-btn ${isDrawComplete ? 'continue-btn--active' : 'continue-btn--disabled'}`}
            onClick={handleDrawContinue}
            disabled={!isDrawComplete}
          >
            Continue
          </button>
        </div>
        </div>
    </div>
  )
}

// Export default
export default Draw;