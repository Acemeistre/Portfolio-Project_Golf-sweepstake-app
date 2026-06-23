import './PlayerSorter.css';

function PlayerSorter({ sortOption, onSortChange }) {
    return (
        <div className="player-sorter">
            <label className="player-sorter__title">
                Sorted by:
            </label>
            <div className='player-sorter__options'>
                <div className="player-sorter__option">
                <input 
                    className="player-sorter__select"
                    type="radio"
                    name="sortOption"
                    value="Ranking"
                    checked={sortOption === "Ranking"}
                    onChange={(e) => onSortChange(e.target.value)}
                    id="sort-ranking"
                    title="sort players by world ranking - highest rank drawn last"
                />
            <label htmlFor="sort-ranking">
                Ranking
            </label>
            <input 
                className="player-sorter__select"
                type="radio"
                name="sortOption"
                value="Odds"
                checked={sortOption === "Odds"}
                onChange={(e) => onSortChange(e.target.value)}
                id="sort-odds"
                title="sort players by odds - highest odds drawn first"
            />
            <label htmlFor="sort-odds">
                Odds
            </label>
            </div>
            </div>
        </div>
    );
}

export default PlayerSorter;