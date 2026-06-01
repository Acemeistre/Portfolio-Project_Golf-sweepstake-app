import './TournamentSelector.css';

const tournaments = [
    { 
        id: 'masters', 
        name: 'The Masters',
        date: 'April 9-12, 2026',
        colour: '#006747',
        apiKey: 'golf_masters_tournament_winner'
    },
    { 
        id: 'pga', 
        name: 'PGA Championship',
        date: 'May 14-17, 2026',
        colour: '#003087',
        apiKey: 'golf_pga_championship_winner'
    },
    { 
        id: 'us-open', 
        name: 'The US Open',
        date: 'June 18-21, 2026',
        colour: '#d30a0a',
        apiKey: 'golf_us_open_winner'
    },
    { 
        id: 'the-open', 
        name: 'The Open Championship',
        date: 'July 17-20, 2026',
        colour: '#C8A84B',
        apiKey: 'golf_the_open_championship_winner'
    },
]

function TournamentSelector({ selectedTournament, onTournamentChange }) {
    return (
    <div className="tournament-selector">
        <label className="tournament-selector__label">
            Select Tournament:
        </label>
        <div className="tournament-selector__cards">
            {tournaments.map((tournament) => (
                <div
                    key={tournament.id}
                    className={`tournament-selector__card ${selectedTournament === tournament.id ? 'tournament-selector__card--selected' : ''}`}
                    style={{ 
                        borderColor: tournament.colour,
                        backgroundColor: selectedTournament === tournament.id ? tournament.colour : 'transparent'
                    }}
                    onClick={() => onTournamentChange(tournament.id)}>

                    <span className={`tournament-selector__card-name ${selectedTournament === tournament.id ? 'tournament-selector__card-name--selected' : ''}`}>
                        {tournament.name}
                    </span>
                    <span className={`tournament-selector__card-date ${selectedTournament === tournament.id ? 'tournament-selector__card-date--selected' : ''}`}>
                        {tournament.date}
                    </span>
                </div>
            ))}
        </div>
    </div>
    )
}

export default TournamentSelector;