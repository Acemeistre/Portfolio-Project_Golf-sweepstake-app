import {useEffect, useState} from "react";
import './App.css';
import Header from "./components/Header/Header";
import TournamentSelector from "./components/TournamentSelector/TournamentSelector";
import PlayerSorter from "./components/PlayerSorter/PlayerSorter";
import ParticipantEntry from "./components/ParticipantEntry/ParticipantEntry";
import Draw from "./components/Stage2_Draw/Stage2_Draw";
import LiveScores from "./components/Stage3_Scores/Stage3_Scores";
import worldRankings from './data/worldRankings.json'

const tournaments = [
    { 
        id: 'masters', 
        name: 'The Masters',
        date: 'April 9-12, 2026',
        location: 'Augusta, Georgia',
        colour: '#006747',
        apiKey: 'golf_masters_tournament_winner',
        isPast: true
    },
    { 
        id: 'pga', 
        name: 'PGA Championship',
        date: 'May 14-17, 2026',
        location: 'Aronimink GC, Pennsylvania',
        colour: '#003087',
        apiKey: 'golf_pga_championship_winner',
        isPast: true
    },
    { 
        id: 'us-open', 
        name: 'The US Open',
        date: 'June 18-21, 2026',
        startDate: '2026-06-18',
        location: 'Shinnecock Hills, New York',
        colour: '#d30a0a',
        apiKey: 'golf_us_open_winner',
        isPast: false,
        pollingWindows: [
        { day: 1, start: '16:30', end: '00:30' },
        { day: 2, start: '16:30', end: '00:30' },
        { day: 3, start: '17:30', end: '00:30' },
        { day: 4, start: '17:30', end: '00:30' },
        ]
    },
    { 
        id: 'the-open', 
        name: 'The Open Championship',
        date: 'July 16-19, 2026',
        location: 'Royal Birkdale, The UK',
        colour: '#C8A84B',
        apiKey: 'golf_the_open_championship_winner',
        isPast: false
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
  const [drawResults, setDrawResults] = useState({})

  const selectedTournamentData = tournaments.find(t => t.id === selectedTournament)
  console.log('selectedTournamentData:', selectedTournamentData)
  
  const dummyPlayers = [
    { name: 'Alex Fitzpatrick', price: 500 },
    { name: 'Sungjae Im', price: 1200},
    { name: 'Justin Rose', price: 1000 },
    { name: 'Shane Lowry', price: 750 },
    { name: 'Jason Day', price: 400},
    { name: 'Adam Scott', price: 1000 },
    { name: 'Michael Kim', price: 100},
    { name: 'Jordan Spieth', price: 350 },
    
]

  // Fetch player odds from API when page first loads
  useEffect(() => {
    // Get API key from the environment variables file

      setPlayers(dummyPlayers)
   
  }, [])
  
  //Check if minimum requirements are met.
  const confirmedParticipants = participants.filter(p => p.isConfirmed)
  const isReadyToContinue = selectedTournament !== '' && confirmedParticipants.length >= 2 && sortOption!== ''

  // Check for unconfirmed rows with text
  const hasUnconfirmedText = participants.some(p => !p.isConfirmed && p.name.trim() !== '')

  const getPlayerRank = (player) => {
        const match = worldRankings.find(entry => entry.fullName === player.name)
    return match ? match.rank : 9999
  }

  //Handle continue button click
  const handleContinue = () => {
    if (hasUnconfirmedText) {
      const confirm = window.confirm("You have an unconfirmed participant. Continue without them?")
    if (!confirm) return
  }

  //Sort players based on selected sort option
  const sortedPlayers = [...players].sort((a, b) => {
    if (sortOption === 'Odds') {
        return b.price - a.price
    } else {
        return getPlayerRank(a) - getPlayerRank(b)
    }
  })
  setPlayers(sortedPlayers)

  const remainder = players.length % confirmedParticipants.length


  setCurrentStage('draw')
  }

  return (
    <div className="app">
      <div className="app__background" />
      <Header showWelcome={currentStage === 'selection'} />
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
        drawResults={drawResults}
        onDrawResults={setDrawResults}
        />
        )}
        {currentStage === 'scores' && (
       
            <LiveScores
            drawResults={drawResults}
            onDrawResults={setDrawResults}
            selectedTournamentData={selectedTournamentData}
            participants={confirmedParticipants}
            />
        )}
          
      </main>
    </div>
  )
}

export default App