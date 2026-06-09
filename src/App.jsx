import {useEffect, useState} from "react";
import './App.css';
import Header from "./components/Header/Header";
import TournamentSelector from "./components/TournamentSelector/TournamentSelector";
import PlayerSorter from "./components/PlayerSorter/PlayerSorter";
import ParticipantEntry from "./components/ParticipantEntry/ParticipantEntry";
import Draw from "./components/Stage2_Draw/Stage2_Draw";

const tournaments = [
    { 
        id: 'masters', 
        name: 'The Masters',
        date: 'April 9-12, 2026',
        location: 'Augusta, Georgia',
        colour: '#006747',
        apiKey: 'golf_masters_tournament_winner'
    },
    { 
        id: 'pga', 
        name: 'PGA Championship',
        date: 'May 14-17, 2026',
        location: 'Aronimink GC, Pennsylvania',
        colour: '#003087',
        apiKey: 'golf_pga_championship_winner'
    },
    { 
        id: 'us-open', 
        name: 'The US Open',
        date: 'June 18-21, 2026',
        location: 'Shinnecock Hills, New York',
        colour: '#d30a0a',
        apiKey: 'golf_us_open_winner'
    },
    { 
        id: 'the-open', 
        name: 'The Open Championship',
        date: 'July 17-20, 2026',
        location: 'Royal Birkdale, The UK',
        colour: '#C8A84B',
        apiKey: 'golf_the_open_championship_winner'
    },
]

function App() {
  const [selectedTournament, setSelectedTournament] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [participants, setParticipants] = useState([
    { id: Date.now(), name: '', colour: '#008BFD', isConfirmed: false },
    { id: Date.now() + 1, name: '', colour: '#F7FF00', isConfirmed: false }
  ]);
  const [currentStage, setCurrentStage] = useState('selection');
  const [players, setPlayers] = useState([]);

  const selectedTournamentData = tournaments.find(t => t.id === selectedTournament)
  console.log('selectedTournamentData:', selectedTournamentData)
  
  const dummyPlayers = [
    { name: 'Player 1', price: 1000 },
    { name: 'Player 2', price: 750 },
    { name: 'Player 3', price: 500 },
    { name: 'Player 4', price: 250 },
    { name: 'Player 5', price: 100 },
    { name: 'Player 6', price: 50 },
    { name: 'Player 7', price: 25 },
    { name: 'Player 8', price: 10 },
    
]

  // Fetch player odds from API when page first loads
  useEffect(() => {
    // Get API key from the environment variables file
    const apiKey = import.meta.env.VITE_ODDS_API_KEY
    // Make request to the odds API
    fetch("https://api.the-odds-api.com/v4/sports/golf_us_open_winner/odds/?apiKey=f4d61d699f0e49a43c473f19cee73ef9&regions=uk&markets=outrights")
    // Open the response envelope
    .then(response => response.json())
    // Navigate to player outcomes and store them
    .then(data => {
      const outcomes = data[0].bookmakers[0].markets[0].outcomes
      setPlayers(dummyPlayers)
    })
  }, [])
  
  //Check if minimum requirements are met.
  const confirmedParticipants = participants.filter(p => p.isConfirmed)
  const isReadyToContinue = selectedTournament !== '' && confirmedParticipants.length >= 2 && sortOption!== ''

  // Check for unconfirmed rows with text
  const hasUnconfirmedText = participants.some(p => !p.isConfirmed && p.name.trim() !== '')

  //Handle continue button click
  const handleContinue = () => {
    if (hasUnconfirmedText) {
      const confirm = window.confirm("You have an unconfirmed participant. Continue without them?")
    if (!confirm) return
  }

  //Sort players based on selected sort option
  const sortedPlayers = [...players].sort((a,b) =>
    sortOption === 'Odds' ? b.price - a.price : b.price - a.price
)
  const remainder = players.length % confirmedParticipants.length


  setCurrentStage('draw')
  }

  return (
    <div className="app">
      <div className="app__background" />
      <Header/>
      <main className="main">
        {currentStage === 'selection' && (
        <>
        <div className="stage1-layout">
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
        </div>
        <div className="continue-btn-wrapper">
          <button 
            className={`continue-btn ${isReadyToContinue ? 'continue-btn--active' : 'continue-btn--disabled'}`}
            onClick={isReadyToContinue ? handleContinue : null}
            disabled={!isReadyToContinue}
          >
            Continue
          </button>
        </div>
        </>
        )}
        {currentStage === 'draw' && (
           <Draw
        selectedTournament={selectedTournament}
        participants={participants.filter(p => p.isConfirmed)}
        players={players}
        onBack={() => setCurrentStage('selection')}
        onComplete={() => setCurrentStage('scores')}
        tournament={selectedTournamentData}
        />
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