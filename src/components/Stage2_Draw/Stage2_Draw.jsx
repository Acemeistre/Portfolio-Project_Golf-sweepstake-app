// Import React and useState
import { useEffect, useState } from 'react';
import './Stage2_Draw.css';

// Import the three column components
import PlayerQueue from './PlayerQueue/PlayerQueue';
import Spinner from './Spinner/Spinner';
import DrawResults from './DrawResults/DrawResults';


// Define the Stage2_Draw component
function Draw({participants, players, onBack, onComplete}) {
// It recieves: participants, players, onBack, onComplete
    const [groupNumber, setGroupNumber] = useState(0);
    const [drawResults, setDrawResults] = useState('');
    const [nextPlayer, setNextPlayer] = useState('')
}