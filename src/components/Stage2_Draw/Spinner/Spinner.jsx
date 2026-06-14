// Import useState, wheel from react-custom-roulette and Spinner.css
import { useState }from 'react'
import { Wheel } from 'react-custom-roulette'
import './Spinner.css'

// Define spinner component that receives: availableParticipants, handleSpin, onComplete and isDrawComplete
function Spinner({availableParticipants, handleSpin, onComplete, isDrawComplete}) {
    // State: has the draw started yet (boolean)
    const [isDrawStarted, setIsDrawStarted] = useState(false);
    // State: should the wheel be spinning (boolean)
    const [spin, setSpin] = useState(false);
    // State: which segment is the prize (number)
    const [prizeNumber, setPrizeNumber] = useState(0);

    // Derived value: format availableParticipants into the data shape the Wheel component expects
    const drawAvailableParticipants = availableParticipants.map(p => ({
        option: p.name, 
        style: {backgroundColor: p.colour}
        
    }));

    // Handler: what happens when the button is clicked
    // Set isDrawStarted to true
    // Pick a random prize number based on available participants length
    // Set Spin to true
    const handleSpinButton = () => {
        setIsDrawStarted(true);
        setPrizeNumber(Math.floor(Math.random() * availableParticipants.length));
        setSpin(true);
    }
    // Handler: what happens when the wheel stops spinning
    // Set Spin to false
    // Call handleSpin with the participant that was landed on
    const handleStopSpinning = () => {
        setSpin(false);
        handleSpin(availableParticipants[prizeNumber])
    }
   // Return the column layout

    // Heading: changes between 'Start the Draw?' and 'Good luck!' based on isDrawStarted
    // Spin button: disabled while spinning or when draw is complete
    // Wheel: renders with participant colours, hidden default pointer replaced by custom CSS pointer
    // Continue button: only active when draw is complete
    return (
        <div className="spinner">
            <h2 className="spinner__heading">
                {isDrawStarted ? 'Good luck!' : 'Start the Draw?'}
            </h2>
            <button
                className={`spinner__btn ${spin? 'spinner__btn--disabled' : ''}`}
                onClick={handleSpinButton}
                disabled={spin || isDrawComplete}
                aria-label="Spin wheel"
                title="Spin wheel"
                >
                {isDrawStarted ? 'Spin again' : 'Go!'} 
                </button>
            
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
        </div>
    )
}
// Export default
export default Spinner
