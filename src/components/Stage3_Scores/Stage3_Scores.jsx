// Import useEffect and useState Hooks. 
// Import ColourPicker component.
// Import playerCountries JSON for getPlayerFlag function for flag lookup and Stage3_Scores css for stage 3 styling.
import { useState, useEffect } from "react"
import ColourPicker from "../ColourPicker/ColourPicker";
import "./Stage3_Scores.css"
import playerCountries from '../../data/playerCountries.json'

// Define the LiveScores function signature
// It receives: drawResults data for colour-coding rows, selectedTournamentData for having the configuration needed for polling window logic, 
// participants for each participants details needed for colour coding and late entry and onDrawResults setter function for updating drawResults in the late entry feature.
function LiveScores({ drawResults, selectedTournamentData, participants, onDrawResults }) {
    // set our intial state values to:
    // false for isPolling, isLoading, wasInWindow and inputOpen
    // null for error and colour
    // empty array for leaderboard and empty string for name
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [isPolling, setIsPolling] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [wasInWindow, setWasInWindow] = useState(false);
    
    const [inputOpen, setInputOpen] = useState(false);
    const [name, setName] = useState('');
    const [colour, setColour] = useState(null);

    // set an asynchronus function for fetchLeaderboard
    const fetchLeaderboard = async () => {
        // set setIsLoading to true to trigger the loading UI whilst the fetch is in progress
        setIsLoading(true)
         try {
        // add a url variable with it's actual address
            const url = "https://live-golf-data.p.rapidapi.com/leaderboard?orgId=1&tournId=026&year=2026"
        // await the response of a fetch that sends url headers x-rapidapi-host and x-rapid-key
            const response = await fetch(url, {headers: {
            'x-rapidapi-host': 'live-golf-data.p.rapidapi.com',
            'x-rapidapi-key': apiKey
            }})
            // set an error message to handle if the response is not ok
            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard data')
            }

            // await the response to be converted using the .json() method and store it in variable 'data'.
            const data = await response.json()
            // update the setLeaderboardData state with our 'data' from leaderboardRows
            setLeaderboardData(data.leaderboardRows)
            // if the try block fails (network error or bad response status), catch the error state to display error message to user
            } catch (error) {
        setError('Something went wrong')
        // after the fetch request has completed setIsLoading back to false to complete the function
        }
        setIsLoading(false)
    }   

    // import the golf slash leaderboard's API key
     const apiKey = import.meta.env.VITE_GOLF_SLASH_LEADERBOARDS_API_KEY 

    // call the fetchLeaderboard using useEffect, with an empty dependency array, called once on mount
    useEffect(() => {
        fetchLeaderboard()
    }, [])

    // set a useEffect to exit if isPolling false, else set an interval of 15 minutes for the fetchLeaderboard call if isPolling changes 
    useEffect(() => {
        if (!isPolling) return
        const interval = setInterval(() => {
            fetchLeaderboard()
        }, 900000) // 15 minutes in milliseconds
        // return a cleanup function to clear the interval when isPolling changes or component unmounts, preventing multiple intervals stacking
        return () => clearInterval(interval)
    }, [isPolling])

    // set up a function to handle polling windows
    const isWithinPollingWindow = () => {
        // set the start date of the selected tournament
        // set a refernce point of the current day of the tournament
        // calculate the milli seconds in a day
        // calculate the number of days since the started of the tounament using math.floor
        // add 1 to daysSinceStart to get the current day of the tournament
        const start = new Date(selectedTournamentData.startDate) 
        const today = new Date()
        const msPerDay = 1000 * 60 * 60 * 24
        const daysSinceStart = Math.floor((today - start) / msPerDay)
        const currentDay = daysSinceStart + 1
        // use the .find method on the pollingWindows value of selectedTournamentData, iterating through each items .day property until its equal to currentDay and save it to a const variable of todaysWindow.
        const todaysWindow = selectedTournamentData.pollingWindows.find(w => w.day === currentDay)
        // guard clause: if no matching window is found (outside tournament dates), return false
        if (!todaysWindow) {
            return false
        }
        // set a string of today by calling the method getHours on it, passing over it with the .padStart tool, to give it a padding of two characters and save that format to a const variable of hours.
        // padding ensure a consistent 'HH:MM' format for reliable string comparison, so do the same logic for minutes
        const hours = String(today.getHours()).padStart(2, '0')
        const minutes = String(today.getMinutes()).padStart(2, '0')
        // use a template literal to combine variables hours and minutes to 'HH:MM' and save as currentTime for use for our polling window start/end times
        const currentTime = `${hours}:${minutes}`
        
        // set a variable to 
        const isOvernight = todaysWindow.start > todaysWindow.end
        if (isOvernight) {
        // inside window if current time is AFTER start OR BEFORE end
        return currentTime >= todaysWindow.start || currentTime <= todaysWindow.end
        } else {
        // inside window if current time is AFTER start AND BEFORE end
        return currentTime >= todaysWindow.start && currentTime <= todaysWindow.end
        }
    }

    useEffect(() => {
        const checkWindow = () => {
            const inWindow = isWithinPollingWindow()
            setWasInWindow(prevWasInWindow => {
        if (inWindow) {
            setIsPolling(true)
        } else if (prevWasInWindow) {
            setIsPolling(false)
        }
       return inWindow
            })
    }

    checkWindow() // check immediately on mount
        const checkInterval = setInterval(checkWindow, 60000) // then check every minute

        return () => clearInterval(checkInterval)
    }, [])

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

    const getPlayerFlag = (player) => {
        const fullName = `${player.firstName} ${player.lastName}`
        const match = playerCountries.find(entry => entry.name === fullName)
    return match ? match.countryCode : 'na'
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
    
    const isValidPlayerName = () => {
        return leaderboardData.some(player => `${player.firstName} ${player.lastName}` === name )
    }

    const isAlreadyDrawn = () => {
        return Object.values(drawResults).some(playerArray => playerArray.some(player => player.name === name)
        )
    }

     return (
        <div className="Stage 3 wrapper">
            <button 
            className="poll-btn"
            onClick={() => setIsPolling(!isPolling)}>
                {isPolling ? "Pause" : "Go Live"}
                <span className={`status-dot ${isPolling? 'status-dot--live' : 'status-dot--paused'}`}></span>
            </button>
        {isLoading && leaderboardData.length === 0 && (
            <p>Loading leaderboard...</p>
        )}
        {isLoading && leaderboardData.length > 0 && (
            <span>Updating...</span>
        )}
        {error && (
        <p>{error}</p>
        )}
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
          {leaderboardData?.map((player) => {
            
            return (
            <tr key={player.playerId} 
                className="leaderboard-row"
                style={{backgroundColor: getPlayerColour(player)}}
                >
              <td className="leaderboard-row__player-position">{player.position}</td>
              <td className="leaderboard-row__player-name">
                {getPlayerFlag(player) === 'na' ? (
                    <span>🌍</span>
                    ) : (
                <img className="player-flag" src={`https://flagcdn.com/${getPlayerFlag(player)}.svg`} alt={player.firstName} />
                    )}
                <span className="player-name--full">{player.firstName} {player.lastName}</span>
                <span className="player-name--short">{player.firstName[0]} {player.lastName}</span>
                </td>
              <td className={`leaderboard-row__player-score ${player.status === 'active' ? 'live-text' : ''}`}>{player.total}</td>
              <td className={`leaderboard-row__player-hole ${player.status === 'active' ? 'live-text' : ''}`}>{player.thru}</td>
            </tr>
            )
          })}
        
        </tbody>
      </table>
      </div>
      <div className="late-entry-form__row">
    <button 
        className={`add-participant__btn ${inputOpen ? 'add-participant__btn--close' : ''}`}
        onClick={() => setInputOpen(!inputOpen)}
        >
           {inputOpen ? 'x' : '+'}
        </button>
        {inputOpen && (
            <>
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
            disabled={!isValidPlayerName() || isAlreadyDrawn()}
            >
            Add
            </button>
            </>
        
        )}
        </div>
        <footer>
            <div className="footer"><p>2026 | Designed and coded by Glenn Niblett (aka Acemeistre)</p><span>Country flags courtesy of <a href="https://flagpedia.net/download">Flagcdn.com / Flagpedia.net</a></span></div>
        </footer>
    </div> 
    )
}

export default LiveScores