import { useEffect } from "react"

function LiveScores() {

    const apiKey = import.meta.env.VITE_GOLF_SLASH_LEADERBOARDS_API_KEY

      useEffect(() => {
        const url = "https://live-golf-data.p.rapidapi.com/leaderboard?orgId=1&tournId=026&year=2025"
      fetch(url, {
        headers: {
            'x-rapidapi-host': 'live-golf-data.p.rapidapi.com',
            'x-rapidapi-key': apiKey
            }
        })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('API Error:', error))
  }, [])

     return (
        <h1>Stage 3</h1>
    )
}

export default LiveScores