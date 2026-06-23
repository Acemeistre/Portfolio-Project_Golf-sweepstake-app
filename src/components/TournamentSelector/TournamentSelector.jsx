import './TournamentSelector.css';

function TournamentSelector({ selectedTournament, onTournamentChange, tournaments }) {
    return (
    <div className="tournament-selector">
        <label className="tournament-selector__label">
            Tournament:
        </label>
        <div className="tournament-selector__cards">
            {tournaments.map((tournament) => (
                <div
                    key={tournament.id}
                    className={`tournament-selector__card 
                        ${selectedTournament === tournament.id ? 'tournament-selector__card--selected' : ''}
                        ${tournament.isPast ? 'tournament-selector__card--past' : ''}`}
                    style={{ 
                        borderColor: tournament.isPast ? '#ccc' : tournament.colour,
                        backgroundColor: selectedTournament === tournament.id ? tournament.colour : 'transparent'
                    }}
                    onClick={() => !tournament.isPast && onTournamentChange(tournament.id)}
                    role="button"
                    aria-disabled={tournament.isPast}
                    aria-label={`Select ${tournament.name}, ${tournament.date}`}
                    aria-pressed={selectedTournament === tournament.id}
                    title={tournament.isPast 
                    ? `${tournament.name} has already taken place` 
                    : `Select ${tournament.name}, ${tournament.date}`}
                    >

                    <span className={`tournament-selector__card-name ${selectedTournament === tournament.id ? 'tournament-selector__card-name--selected' : ''}`}>
                        {tournament.name}
                    </span>
                    <span className={`tournament-selector__card-date ${selectedTournament === tournament.id ? 'tournament-selector__card-date--selected' : ''}`}>
                        {tournament.date}
                    </span>
                    <span className={`tournament-selector__card-location ${selectedTournament === tournament.id ? 'tournament-selector__card-date--selected' : ''}`}>
                        {tournament.location}
                    </span>
                </div>
            ))}
        </div>
    </div>
    )
}

export default TournamentSelector;