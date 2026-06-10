// Import useState, wheel from react-custom-roulette and Spinner.css
import { useState }from 'react'
import { Wheel } from 'react-custom-roulette'
import './Spinner.css'
import ColourPicker from '../../ColourPicker/ColourPicker';

// Define spinner component that receives: currentRoundPlayers, availableParticipants, handleSpin
function Spinner({availableParticipants, handleSpin}) {
    // State: has the draw started yet (boolean)
    const [isDrawStarted, setIsDrawStarted] = useState(false);
    // State: should the wheel be spinning (boolean)
    const [spin, setSpin] = useState(false);
    // State: which segment is the prize (number)
    const [prizeNumber, setPrizeNumber] = useState(0);

    // Derived value: format availableParticipants into the data shape the Wheel component expects
    const drawAvailableParticipants = availableParticipants.map(p => ({
        option: p.name, 
        style: {backgroundColor: p.colour},
        
    }));

    // Handler: what happens when the button is clicked
    // Set isDrawStarted to true
    // Pick a random prize number based on available participants length
    // Set mustSpin to true
    const handleSpinButton = () => {
        setIsDrawStarted(true);
        setPrizeNumber(Math.floor(Math.random() * availableParticipants.length));
        setSpin(true);
    }
    // Handler: what happens when the wheel stops spinning
    // Set mustSpin to false
    // Call handleSpin with the participant that was landed on
    const handleStopSpinning = () => {
        setSpin(false);
        handleSpin(availableParticipants[prizeNumber])
    }
   // Return the column layout

    // The combined button (Start the Draw? / Good luck!) based on isDrawStarted
    // The Wheel component with its required props
    return (
        <div className="spinner">
            <h2 className="spinner__heading">
                {isDrawStarted ? 'Good luck!' : 'Start the Draw?'}
            </h2>
            <button
                className={`spinner__btn ${spin? 'spinner__btn--disabled' : ''}`}
                onClick={handleSpinButton}
                disabled={spin}
                aria-label="Spin wheel"
                title="Spin wheel"
                >
                {isDrawStarted ? 'Spin again' : 'Go!'} 
                </button>
                {drawAvailableParticipants.length > 0 && (
            <div className="spinner__wheel-wrapper">
                {drawAvailableParticipants.length > 0 && (
                <Wheel 
                    mustStartSpinning={spin}
                    prizeNumber={prizeNumber}
                    data={drawAvailableParticipants}
                    onStopSpinning={handleStopSpinning}
                    outerBorderColor="#C8A84B"
                    radiusLineColor="#C8A84B"
                    pointerProps={{ style: { display: 'none' } }}
                    spinDuration={0.5}
                />
                )}
            <div className="spinner__pointer" />
        </div>
            )}
        </div>
    )
}
// Export default
export default Spinner
