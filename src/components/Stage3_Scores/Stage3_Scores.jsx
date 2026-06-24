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
        // safeguard burning through API calls by adding a check on fetch to selectedTournamentData by seeing if any polling windows are set
        if (selectedTournamentData?.pollingWindows) {
        fetchLeaderboard()
        }
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
        // guard clause: if tournament has no polling windows configured, return false immediately
        if (!selectedTournamentData?.pollingWindows) {
            return false
        }
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
        
        // set a variable to check whether the polling windows' crosses the midnight boundary seperating two days
        const isOvernight = todaysWindow.start > todaysWindow.end
        if (isOvernight) {
        // time can be overnight if currentTime is either after todaysWindow start time OR before todaysWindow end
        return currentTime >= todaysWindow.start || currentTime <= todaysWindow.end
        } else {
        // times can't be overnight if currentTime is both after todaysWindow start time AND before todaysWindow end
        return currentTime >= todaysWindow.start && currentTime <= todaysWindow.end
        }
    }

    // set a useEffect to check the moment of when our polling window transitions from inside to outside, including empty depedency to fire once, on mount 
    useEffect(() => {
        const checkWindow = () => {
            // set a const variable for checking the current state of isWithinPollingWindow
            const inWindow = isWithinPollingWindow()
        // use the state value of setWasInWindow to check the previous value of WasInWindow
        setWasInWindow(prevWasInWindow => {
        if (inWindow) {
            // turn polling on if inWindow was true
            setIsPolling(true)
        } else if (prevWasInWindow) {
            // turn polling off if prevInWindow was true but inWindow is false
            setIsPolling(false)
        }
        // return inWindow to update wasInWindow with the current result, ready for the next 60-second check
        return inWindow
        })
        }
        checkWindow() // check immediately on mount
            const checkInterval = setInterval(checkWindow, 60000) // then check every minute
        // return a cleanup function to clear the interval when the component unmounts, preventing multiple intervals stacking
        return () => clearInterval(checkInterval)
    }, [])

    // set a function for getPlayerColour that uses targetPlayer as its argument
    const getPlayerColour = (targetPlayer) => {
        // set a variable for colour without data
        let colour = null
        // grab the entries property from our drawResults object, passing over each entry with their id and playerArray
        Object.entries(drawResults).forEach(([id, playerArray]) => {
            // using a template literal combine the target player's first name and last name, saving it to a const variable of full name
            const fullName = `${targetPlayer.firstName} ${targetPlayer.lastName}`
            // use the .find() method to pass over each item in the playerArray and save it to a const variable of match when the item name is equal to full name
            const match = playerArray.find(drawnPlayer => drawnPlayer.name === fullName)
            // use the .find() method to pass over each item in participants and save it to a const variable of participant when the item id is equal to the id of number
            // our comparison id comes from Object.entries(drawResults) which is a string, so Number() converts that string back to a number for equal type and value comparison
            if (match) {
                const participant = participants.find(p => p.id === Number(id))
                // set the variable of colour to the value of partcipant colour
                colour = participant.colour
            }
        })
        // return the value of colour
        return colour
    }

    // set a function for getParticipantName that uses targetPlayer as its argument
    const getParticipantName = (targetPlayer) => {
        // set a variable for participant name without data
        let participantName = null
        // grab the entries property from our drawResults object, passing over each entry with their id and playerArray
        Object.entries(drawResults).forEach(([id, playerArray]) => {
            // using a template literal combine the target player's first name and last name, saving it to a const variable of full name
            const fullName = `${targetPlayer.firstName} ${targetPlayer.lastName}`
            // use the .find() method to pass over each item in the playerArray and save it to a const variable of match when the item name is equal to full name
            const match = playerArray.find(drawnPlayer => drawnPlayer.name === fullName)
            // use the .find() method to pass over each item in participants and save it to a const variable of participant when the item id is equal to the id of number
            // our comparison id comes from Object.entries(drawResults) which is a string, so Number() converts that string back to a number for equal type and value comparison
            if (match) {
                const participant = participants.find(p => p.id === Number(id))
                // set the variable of participantName to the value of participant name
                participantName = participant.name
            }
        })
        // return the value of participantName
        return participantName
    }



    // set a function for getPlayerFlag that uses player as its argument
    const getPlayerFlag = (player) => {
        // using a template literal combine the player's first name and last name, saving it to a const variable of full name
        const fullName = `${player.firstName} ${player.lastName}`
        // use the .find() method to pass over each item in the playerCountries array and save it to a const variable of match when the items name is equal to our player fullName
        const match = playerCountries.find(entry => entry.name === fullName)
        // use a ternary operator to return the condition of our match using its .countryCode value if true or a string of na if false
    return match ? match.countryCode : 'na'
    }
    
    // set a function for late entry submission that finds a matching participant by colour and adds a new player name to that participant's respective drawResults array, then resets the form
    const handleAddLateEntry = () => {
        // use the .find() method to pass over each item in the participants array and save it to a const variable of matchedParticipant when the value of the item colour matches the colour state
        const matchedParticipant = participants.find(p => p.colour === colour)
        // use the state change setter onDrawResults to look at the previous results (prev =>) and copy this result
        onDrawResults(prev => ({
            ...prev,
            //  look at the id of our matched participant and copy this, adding the name value to the end of our array
            [matchedParticipant.id]: [...prev[matchedParticipant.id], 
                { name: name }]    
        }))
        // reset the entry field states on successful player entry/submission
        setName('')
        setColour(null)
        setInputOpen(false)
    }
    
    // set a function to check the validity of a player name entry by using the .some() method to pass over the player items in the leaderboardData array,
    // using a template literal to check that each of the player's firstName and lastName are equal to a name in leaderboardData
    const isValidPlayerName = () => {
        return leaderboardData.some(player => `${player.firstName} ${player.lastName}` === name )
    }

    // set a function to prevent duplicate late entries by checking if a player has already been drawn by returning the values of drawResults object and using the .some() method 
    // to pass over each playerArray item and each name value within each playerArray against the name in drawResults
    const isAlreadyDrawn = () => {
        return Object.values(drawResults).some(playerArray => playerArray.some(player => player.name === name)
        )
    }

     return (
        <div className="stage3-wrapper">
            <button 
            className="poll-btn"
            title={isPolling ? "pause the polling for live score updates " 
            : "Receive live score updates every 15 minutes"}
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
            <th className="leaderboard-table__header-position"
                title="current tournament leaderboard position">#</th>
            <th className="leaderboard-table__header-name"
            >Player</th>
            <th className="leaderboard-table__header-score">Score</th>
            <th className="leaderboard-table__header-hole">Hole</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData?.map((player) => {
            const participantName = getParticipantName(player)
            return (
            <tr key={player.playerId} 
                className="leaderboard-row"
                style={{backgroundColor: getPlayerColour(player)}}
                title={participantName ? `This player belongs to ${participantName}` : null }
                >
              <td className="leaderboard-row__player-position">
                {player.position}
              </td>
              <td className="leaderboard-row__player-name">
                {getPlayerFlag(player) === 'na' ? (
                    <span>🌍</span>
                    ) : (
                <img className="player-flag" 
                     src={`https://flagcdn.com/${getPlayerFlag(player)}.svg`} 
                     alt={player.firstName} 
                     title="Player nationality"
                     />
                    )}
                <span className="player-name--full">{player.firstName} {player.lastName}</span>
                <span className="player-name--short">{player.firstName[0]}. {player.lastName}</span>
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
        title={inputOpen ? "close late player entry form" : "add a late player addition" }
        aria-label="Add late player entry"
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
    </div> 
    )
}

export default LiveScores