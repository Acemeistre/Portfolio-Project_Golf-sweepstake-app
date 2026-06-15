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
        <h1>Stage 3</h1>
    )
}

export default LiveScores