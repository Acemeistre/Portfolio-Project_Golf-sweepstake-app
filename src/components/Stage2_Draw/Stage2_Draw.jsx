// Import React and useState
import { useState } from 'react';
import './Stage2_Draw.css';

// Import the three column components
import PlayerQueue from './PlayerQueue/PlayerQueue';
import Spinner from './Spinner/Spinner';
import DrawResults from './DrawResults/DrawResults';


// Define the Stage2_Draw component
// It recieves: selectedTournament, tournament, participants, players, onBack, onComplete, onReset
function Draw({ tournament, participants, players, onBack, onComplete}) {

  // State: which group are we currently drawing for (start at 0)
  // State: the draw results so far (an object or array mapping participants to their players)
  // State: which participants are still available to spin for the current group
    const [currentRound, setCurrentRound] = useState(0);
    const [drawResults, setDrawResults] = useState({});
    const [availableParticipants, setAvailableParticipants] = useState(participants)

 // Derived value: calculate remainder and current round players
const remainder = players.length % participants.length

//Derived value: calculate where, in the players array, does the current round begin
/*How it does it: If there is no remainder → end at '(currentRound + 1) * participants.length'
Otherwise, if we're in the remainder round (round 0) → end at 'remainder'
Otherwise → end at 'remainder + (currentRound - 1) * participants.length'*/
const currentRoundStart = remainder === 0
    ? currentRound * participants.length
    : currentRound === 0
        ? 0
        : remainder + (currentRound - 1) * participants.length

//Derived value: calculate where, in the players array, does the current round end
// Same logic as currentRoundStart but calculates the end index instead of the start
const currentRoundEnd = remainder === 0
    ? (currentRound + 1) * participants.length
    : currentRound === 0
        ? remainder
        : remainder + currentRound * participants.length

//Derived value: calculate the current round using currentRoundStart and currentRoundEnd
const currentRoundPlayers = players.slice(currentRoundStart, currentRoundEnd)

//Derived value: grab the values from drawResults and place them in a single array to track the drawnPlayers
const drawnPlayers = Object.values(drawResults).flat()

//Derived value: fiter out the drawn players at the end of each spin from the player queue
const remainingPlayers = players
    //stamp the original player index for playerQueue to calculate the correct round number
    .map((p, index) => ({ ...p, originalIndex: index }))
    //keep only the players whose name IS NOT found in the drawnPlayers array
    .filter(p => !drawnPlayers.find(dp => dp.name === p.name))

// Derived value: Track which player in the current round should be assigned next
const playerIndex = participants.length - availableParticipants.length

//Derived value: Tracks whether the draw has begun or not.
const hasDrawStarted = Object.keys(drawResults).length > 0

//Derived value: tracks when the draw has been completed
const isDrawComplete = remainingPlayers.length === 0

// Handler: what happens when a spin lands on a participant
const handleSpin = (participant) => {
    if (participant) {
        // Remove the landed participant from the available list for this round
        const updatedParticipants = availableParticipants.filter(p => p.id !== participant.id)  
        setAvailableParticipants(updatedParticipants)
        // Add the current round's player to this participant's draw results
        setDrawResults(prev => ({
            ...prev,
            [participant.id]: [...(prev[participant.id] || []), currentRoundPlayers[playerIndex]]
        }))

// If this was the last spin of the round...
if (playerIndex + 1 >= currentRoundPlayers.length) {
    // Delay state updates to avoid React timing issues
    setTimeout(() => {
        // Fill any empty participant arrays with a placeholder
        // (handles remainder participants who weren't drawn in round 0)
        setDrawResults(prev => {
            const updated = { ...prev }
            participants.forEach(p => {
                if (!updated[p.id] || updated[p.id].length === 0) {
                    updated[p.id] = [{ name: '-', price: null }]
                }
            })
            return updated
        })
        // Advance to next round and reset available participants
        setCurrentRound(prev => prev + 1)
        setAvailableParticipants(participants)
    }, 500)
}
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

  // Return the stage 2 layout

  // Column 1 (PlayerQueue): full player list with round highlighting
  // Column 2 (Spinner): wheel and spin button
  // Column 3 (DrawResults): draw results table with current and previous round players
  // stage2-buttons contains the back, continue and restart buttons below the columns
  return (
    <div className="stage2-layout">
      <div className='stage2-columns'>
        <PlayerQueue
        players={remainingPlayers}
        currentRoundPlayers={currentRoundPlayers}
        participants={participants}
        currentRound={currentRound}
        remainder={remainder}
        tournament={tournament}
        playerIndex={playerIndex}
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