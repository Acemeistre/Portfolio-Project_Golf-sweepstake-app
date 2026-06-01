import './PlayerSorter.css';

function PlayerSorter({ sortOption, onSortChange }) {
    return (
        <div className="player-sorter">
            <label className="player-sorter__label">
                Sort Players:
            </label>
            <input 
                className="player-sorter__select"
                type="radio"
                name="sortOption"
                value="Ranking"
                checked={sortOption === "Ranking"}
                onChange={(e) => onSortChange(e.target.value)}
            />
            <label className="player-sorter__label">
                Ranking
            </label>
            <input 
                className="player-sorter__select"
                type="radio"
                name="sortOption"
                value="Odds"
                checked={sortOption === "Odds"}
                onChange={(e) => onSortChange(e.target.value)}
            />
            <label className="player-sorter__label">
                Odds
            </label>
        </div>
    );
}

export default PlayerSorter;