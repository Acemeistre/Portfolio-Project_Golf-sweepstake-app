import {useEffect} from "react"

function App() {
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
  
  return (
    <div>
      <h1>Golf Sweepstake</h1>
    </div>
  )
}

export default App