import { useState, useEffect } from "react"

function LiveScores({ drawResults, selectedTournamentData, participants }) {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [isPolling, setIsPolling] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
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

     return (
         <div className="leaderboard">
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
            <tr key={player.playerId} className="leaderboard-row">
              <td className="leaderboard-row__player-position">{player.position}</td>
              <td className="leaderboard-row__player-name">{player.firstName} {player.lastName}</td>
              <td className="leaderboard-row__player-score">{player.total}</td>
              <td className="leaderboard-row__player-hole">{player.thru}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    )
}

export default LiveScores