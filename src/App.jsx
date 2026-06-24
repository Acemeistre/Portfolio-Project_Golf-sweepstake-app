// Import useEffect and useState Hooks. 
// Import Header, Tournament Selector, Player Sorter, ParticipantEntry, Draw and LiveScores components.
// Import worldRankings JSON for PlayerSorter and App css for stage 1 styling.
import {useEffect, useState} from "react";
import './App.css';
import Header from "./components/Header/Header";
import TournamentSelector from "./components/TournamentSelector/TournamentSelector";
import PlayerSorter from "./components/PlayerSorter/PlayerSorter";
import ParticipantEntry from "./components/ParticipantEntry/ParticipantEntry";
import Draw from "./components/Stage2_Draw/Stage2_Draw";
import LiveScores from "./components/Stage3_Scores/Stage3_Scores";
import worldRankings from './data/worldRankings.json'

// Set key-value pairs in a static array to configure tournament data, including: id, name, date, location, colour, apiKey, isPast and polling windows.
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
        isPast: true,
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

// Temporary placeholder player data to set a static array configuration data for use in PlayerQueue
// To be replaced with live fetch from The Odds API, returning real player names, once call quota resets.
const dummyPlayers = [
  { name: 'Alex Fitzpatrick', price: 500 , rank: 69 },
  { name: 'Sungjae Im', price: 1200, rank: 74 },
  { name: 'Justin Rose', price: 1000, rank: 7 },
  { name: 'Shane Lowry', price: 750, rank: 44 },
  { name: 'Jason Day', price: 400, rank: 47},
  { name: 'Adam Scott', price: 1000, rank: 49 },
  { name: 'Michael Kim', price: 100, rank: 50 },
  { name: 'Jordan Spieth', price: 350, rank: 51 },
  ]

// use the .map() method to return all the players in World Rankings and save the values as name and rank and set price to null,
// saving it to a const variable of rankingAsPlayers so that we reshape our worldRankings.json data into the shape our App expects 
const rankingsAsPlayers = worldRankings.map(player => ({
    name: player.fullName,
    rank: player.rank,
    price: null
}))

// Set data array for default participants in the Participant entry useState as the initial fallback value.
const defaultParticipants = [
  { id: Date.now(), name: '', colour: '#F37D78', isConfirmed: false },
  { id: Date.now() + 1, name: '', colour: '#F6F896', isConfirmed: false }, 
  ];

function App() {
  // Set the state of the selectedTournament
  const [selectedTournament, setSelectedTournament] = useState(() => {
    // Intialize a const variable to retrieve data from local storage if a 
    // previous selection was saved, otherwise default to an empty string.
    const saved = localStorage.getItem('selectedTournament')
    return saved || ''
  });

  // Set the state of the sortOption
  // Deliberately not persisted to localStorage as a means of acting as a natural confirmation step before moving to stage 2.
  const [sortOption, setSortOption] = useState('');

  // Set the state of the participants
  const [participants, setParticipants] = useState(() => {
    // Intialize a const variable to retrieve data from local storage if a 
    // previous selection was saved.
    const saved = localStorage.getItem('participants')
    // Add in a try/catch block to guard against potential data errors, using JSON.parse,
    // otherwise fallback and return defaultParticipants array.
    try {
    return saved ? JSON.parse(saved) : defaultParticipants
    } catch {
    return defaultParticipants
    }
  });

  // Set the state of the currentStage
  const [currentStage, setCurrentStage] = useState(() => {
    // Intialize a const variable to retrieve data from local storage if a 
    // previous selection was saved, otherwise default to the 'selection' stage.
    const saved = localStorage.getItem('currentStage')
    return saved || 'selection'
  });
  
  // Set the state of the players
  const [players, setPlayers] = useState(() => {
    // Intialize a const variable to retrieve data from local storage if a 
    // previous selection was saved.
    const saved = localStorage.getItem('players')
    // Add in a try/catch block to guard against potential data errors, using JSON.parse,
    // otherwise fallback and return the dummyPlayers array.
    try {
    return saved ? JSON.parse(saved) : rankingsAsPlayers
    } catch {
    return rankingsAsPlayers
    }
  });

  // Set the state of the drawResults
  const [drawResults, setDrawResults] = useState(() => {
    // Intialize a const variable to retrieve data from local storage if a 
    // previous selection was saved.
    const saved = localStorage.getItem('drawResults')
    // Add in a try/catch block to guard against potential data errors, using JSON.parse,
    // otherwise fallback and return an empty object.
    // NOTE: drawResults is and object keyed by participant ID, each holding an array of their drawn players
    // e.g. { participantId: [{ name: 'Player1', price: 1000 }], ... }
    try {
    return saved ? JSON.parse(saved) : {}
    } catch {
    return {}
    }
  });

  // derived value: set the object of selectedTournamentData using .find() on the tournaments array and return the item that matches its id.
  const selectedTournamentData = tournaments.find(item => item.id === selectedTournament)
  
  // name and save the value of selectedTournament to the selectedTournament key in local storage, using its dependency array of selectedTournament whenever its value changes.
  useEffect(() => {
    localStorage.setItem('selectedTournament', selectedTournament)
  }, [selectedTournament])
 
  // name and save the value of participants, using JSON.stringify() to the participants key in local storage, using its dependency array of participants whenever its value changes.
  useEffect(() => {
   localStorage.setItem('participants', JSON.stringify(participants))
  }, [participants])

  // name and save the value of currentStage to the currentStage key in local storage, using its dependency array of currentStage whenever its value changes.
  useEffect(() => {
  localStorage.setItem('currentStage', currentStage)
  }, [currentStage])
  
  // name and save the value of players, using JSON.stringify() to the players key in local storage, using its dependency array of players whenever its value changes.
  useEffect(() => {
  localStorage.setItem('players', JSON.stringify(players))
  }, [players])

  // name and save the value of drawResults, using JSON.stringify() to the drawResults key in local storage, using its dependency array of drawResults whenever its value changes.
  useEffect(() => {
  localStorage.setItem('drawResults', JSON.stringify(drawResults))
  }, [drawResults])  
  
  // set a derived variable to filter participants that are confirmed.
  const confirmedParticipants = participants.filter(p => p.isConfirmed)

  // set a button check to confirm a tournament is selected, a sort option is selected and there are 2 or more participants that have been confirmed in order for continue button to be enabled.
  const isReadyToContinue = selectedTournament !== '' && confirmedParticipants.length >= 2 && sortOption!== ''

  // Check for any unconfirmed participant rows with text, checking they're not already confirmed and preventing whitespace bugs using .trim().
  // NOTE - This derived value gets used for a warning dialogue on clicking the continue button, preventing users from accidental loss of unconfirmed entries.
  const hasUnconfirmedText = participants.some(p => !p.isConfirmed && p.name.trim() !== '')

  // set a function to get Player rank, using player as its argument  
  const getPlayerRank = (player) => {
    // set a variable 'match' and use method .find with our imported worldRankings to go through each entry item where the item's full name equals the player name
        const match = worldRankings.find(entry => entry.fullName === player.name)
        // return our match condition to their rank for our truthy value or 9999 for a fallback 'worse that top 500 rank' falsey value
    return match ? match.rank : 9999
  }

  // Handles the Continue button click:
  // 1. Warns if any participant has unconfirmed text, giving the user a chance to go back
  const handleContinue = () => {
    if (hasUnconfirmedText) {
      const confirm = window.confirm("You have an unconfirmed participant. Continue without them?")
    if (!confirm) return
    }

    // 2. Sort players array based on selected sort option, keeping the array of players and using .sort array method
    const sortedPlayers = [...players].sort((a, b) => {
      // sort players of selection 'Odds', returning the highest value to the lowest
      if (sortOption === 'Odds') {
          if (a.price === b.price) {
            // if both players have the same odds, sort alphabetically
            return a.name.localeCompare(b.name)
            }
          return b.price - a.price
          // sort players on selection of ranking going from lowest rank to highest.
          } else {
          const rankA = getPlayerRank(a)
          const rankB = getPlayerRank(b)
          if (rankA === rankB) {
          // if both players have the same rank, sort alphabetically
          return a.name.localeCompare(b.name)
          }
        return rankB - rankA
      }
    })

    // 3. use setPlayers to change the data to the selection of sortedPlayers
    setPlayers(sortedPlayers)
    // progress the app to the 'draw' stage using setCurrentStage
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
        tournaments={tournaments}
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
            title={
            !selectedTournament ? 'Please select a tournament first' :
            !sortOption ? 'Please select a sort option' :
            confirmedParticipants.length < 2 ? 'Please confirm at least 2 participants' :
            'Continue to the draw'
            }
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
          sortOption={sortOption}
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
        <footer>
            <div className="footer">
                <span className='footer__version'>v1.1.06.26</span>
                <p className="footer__credit">Designed and coded by Glenn Niblett (aka Acemeistre)</p>
                {currentStage === 'scores' && (
                    <span className="footer__flags">Country flags courtesy of <a href="https://flagpedia.net/download">Flagcdn.com / Flagpedia.net</a></span>
                )}
            </div>
        </footer>
    </div>
  )
}

export default App