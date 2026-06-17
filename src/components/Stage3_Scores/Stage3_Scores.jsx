import { useState, useEffect } from "react"
import ColourPicker from "../ColourPicker/ColourPicker";
import "./Stage3_Scores.css"

function LiveScores({ drawResults, selectedTournamentData, participants, onDrawResults }) {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [isPolling, setIsPolling] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [inputOpen, setInputOpen] = useState(false);
    const [name, setName] = useState('');
    const [colour, setColour] = useState(null);

    const fetchLeaderboard = async () => {
        setIsLoading(true)
         try {
        // code that might fail goes here
            const url = "https://live-golf-data.p.rapidapi.com/leaderboard?orgId=1&tournId=026&year=2025"
            const response = await fetch(url, {headers: {
            'x-rapidapi-host': 'live-golf-data.p.rapidapi.com',
            'x-rapidapi-key': apiKey
            }})
            const data = await response.json()
        setLeaderboardData(data.leaderboardRows)
            } catch (error) {
        setError('Something went wrong')
        }
        setIsLoading(false)
    }   

    const apiKey = import.meta.env.VITE_GOLF_SLASH_LEADERBOARDS_API_KEY

    useEffect(() => {
        fetchLeaderboard()
  }, [])

    useEffect(() => {
        if (!isPolling) return

        const interval = setInterval(() => {
            fetchLeaderboard()
        }, 900000) // 15 minutes in milliseconds

        return () => clearInterval(interval)
    }, [isPolling])

    const isWithinPollingWindow = () => {
        const start = new Date(selectedTournamentData.startDate)
        const today = new Date()
        const msPerDay = 1000 * 60 * 60 * 24
        const daysSinceStart = Math.floor((today - start) / msPerDay)
        const currentDay = daysSinceStart + 1
        const todaysWindow = selectedTournamentData.pollingWindows.find(w => w.day === currentDay)
        
        const now = new Date()
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        const currentTime = `${hours}:${minutes}`

        const isOvernight = todaysWindow.start > todaysWindow.end
        if (isOvernight) {
        // inside window if current time is AFTER start OR BEFORE end
        return currentTime >= todaysWindow.start || currentTime <= todaysWindow.end
        } else {
        // inside window if current time is AFTER start AND BEFORE end
        return currentTime >= todaysWindow.start && currentTime <= todaysWindow.end
        }
    }



    const getPlayerColour = (targetPlayer) => {
        let colour = null
        Object.entries(drawResults).forEach(([id, playerArray]) => {
            const fullName = `${targetPlayer.firstName} ${targetPlayer.lastName}`
            const match = playerArray.find(drawnPlayer => drawnPlayer.name === fullName)
            if (match) {
                const participant = participants.find(p => p.id === Number(id))
                colour = participant.colour
            }
        })
        return colour
    }

    const handleAddLateEntry = () => {
        const matchedParticipant = participants.find(p => p.colour === colour)
        onDrawResults(prev => ({
            ...prev,
            [matchedParticipant.id]: [...prev[matchedParticipant.id], 
                {name: name, price:null}]    
        }))
        setName('')
        setColour(null)
        setInputOpen(false)
    }
    

     return (
         <div className="leaderboard">
            <button 
            className="poll-btn"
            onClick={() => setIsPolling(!isPolling)}>
                {isPolling ? "Pause" : "Go Live"}
                <span className={`status-dot ${isPolling? 'status-dot--live' : 'status-dot--paused'}`}></span>
            </button>
      <table className="leaderboard-table">
        <thead className="leaderboard-table__header">
          <tr>
            <th className="leaderboard-table__header-position">#</th>
            <th className="leaderboard-table__header-name">Player</th>
            <th className="leaderboard-table__header-score">Score</th>
            <th className="leaderboard-table__header-hole">Hole</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((player) => (
            <tr key={player.playerId} 
                className="leaderboard-row"
                style={{backgroundColor: getPlayerColour(player)}}
                >
              <td className="leaderboard-row__player-position">{player.position}</td>
              <td className="leaderboard-row__player-name">{player.firstName} {player.lastName}</td>
              <td className="leaderboard-row__player-score">{player.total}</td>
              <td className="leaderboard-row__player-hole">{player.thru}</td>
            </tr>
          ))}
        </tbody>
      </table>
    <button 
        className="add-participant"
        onClick={() => setInputOpen(true)}
        >
           +
        </button>
        {inputOpen && (
            <div className="late-entry-form">
            <input 
                className="late-entry__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <ColourPicker className="participant-entry__colour-swatch"
            currentColour={colour}
            takenColours={[]}
            onColourChange={(newColour) => setColour(newColour)}  
            />
            <button 
            className="late-entry__confirm-btn"
            onClick={handleAddLateEntry}
            >
            Add
            </button>
        </div>
        )}
    </div>
    )
}

export default LiveScores