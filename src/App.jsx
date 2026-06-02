import {useEffect, useState} from "react"
import Header from "./components/Header/Header";
import TournamentSelector from "./components/TournamentSelector/TournamentSelector";
import PlayerSorter from "./components/PlayerSorter/PlayerSorter";

import ParticipantEntry from "./components/ParticipantEntry/ParticipantEntry";

function App() {
  const [selectedTournament, setSelectedTournament] = useState('');
  const [sortOption, setSortOption] = useState('Ranking');
  const [participants, setParticipants] = useState([
    { id: 1, name: '', colour: '#008BFD', isConfirmed: false },
    { id: 2, name: '', colour: '#F7FF00', isConfirmed: false }
  ]);
  const [currentStage, setCurrentStage] = useState('selection')

  // Fetch player odds from API when page first loads
  useEffect(() => {
    // Get API key from the environment variables file
    const apiKey = import.meta.env.VITE_ODDS_API_KEY
    // Make request to the odds API
    fetch("https://api.the-odds-api.com/v4/sports/golf_us_open_winner/odds/?apiKey=f4d61d699f0e49a43c473f19cee73ef9&regions=uk&markets=outrights")
    // Open the response envelope
    .then(response => response.json())
    // Navigate to player outcomes and log them
    .then(data => {
      const outcomes = data[0].bookmakers[0].markets[0].outcomes
      console.log(outcomes)
    })
  }, [])
  
  //Check if minimum requirements are met.
  const confirmedParticipants = participants.filter(p => p.isConfirmed)
  const isReadyToContinue = selectedTournament !== '' && confirmedParticipants.length >= 2

  // Check for unconfirmed rows with text
  const hasUnconfirmedText = participants.some(p => !p.isConfirmed && p.name.trim() !== '')

  //Handle continue button click
  const handleContinue = () => {
    if (hasUnconfirmedText) {
      const confirm = window.confirm("You have an unconfirmed participant. Continue without them?")
    if (!confirm) return
  }
  setCurrentStage('draw')
  }

  return (
    <div className="app">
      <Header/>
      <main className="main">
        {currentStage === 'selection' && (
        <>
        <TournamentSelector
        selectedTournament={selectedTournament}
        onTournamentChange={setSelectedTournament}
        />
        <PlayerSorter
          sortOption={sortOption}
          onSortChange={setSortOption}
        />
        <ParticipantEntry
          participants={participants}
          onParticipantsChange={setParticipants}
        />
        <div className="continue-btn-wrapper">
          <button 
            className={`continue-btn ${!isReadyToContinue ? 'continue-btn--active' : 'continue-btn--disabled'}`}
            onClick={isReadyToContinue ? handleContinue : null}
            disabled={!isReadyToContinue}
          >
            Continue
          </button>
        </div>
        </>
        )}
        {currentStage === 'draw' && (
          <div> 
            <h2>Stage 2 - The Draw</h2>
            <button onClick={() => setCurrentStage('selection')}>
              Back to Selection
            </button>
          </div>
        )}
        {currentStage === 'scores' && (
          <div>
            <h2>Stage 3 - Live Scores</h2>
            </div>
        )}
          
      </main>
    </div>
  )
}

export default App