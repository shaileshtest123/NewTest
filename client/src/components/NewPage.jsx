import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'
const PokerPlayer = ({ playerIndex, onRollDice, onLimit }) => {
  const [rolls, setRolls] = useState([]);
  const [score, setScore] = useState(0);
  const [rollsRemaining, setRollsRemaining] = useState([]);

  const rollDice = () => {
    //console.log("limit",onLimit);
    if(onLimit[playerIndex]===0){
      alert('You have used all your chances.');
      return;
    }
    const newRolls = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
    setRolls(newRolls);

    const newScore = newRolls.reduce((acc, roll) => acc + roll, 0);
    setScore(newScore);

    onRollDice(playerIndex, newRolls);
    const updatedRollsRemaining = [...rollsRemaining];
    updatedRollsRemaining[playerIndex] -= 1;
    setRollsRemaining(updatedRollsRemaining);
  };

  const myStyleRoll = {
    color: "black",
    padding: "10px",
    "font-family": "sans-serif",
    width: "100%",
    "box-shadow": "10px 5px 5px lightblue",
    border: "1px solid #909090",
    top: "16px",
    position: "relative",
    margin:"10px 0px"
  };

  return (
    <div style={myStyleRoll}>
      <h2>Player {playerIndex + 1}</h2>
      <button style={{ padding: '5px 10px', margin: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={rollDice} disabled={rollsRemaining[playerIndex] === 0}>Roll Dice</button>
      <p>Rolls: {rolls.map((roll, i) => (
        <img loading="eager" style={{"left":"10px","position":"inherit","margin":"0 10px","width":"10%"}} class="rollimg" key={i} src={`/images/dice${roll}.png`} alt={`Die ${roll}`} />
      ))}</p>
      <p>Score: {score}</p>
    </div>
  );
};

const NewPage = () => {
  const [playerScores, setPlayerScores] = useState([]);
  const [numPlayers, setNumPlayers] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [winnerPlayer, setWinnerPlayer] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [rollsRemaining, setRollsRemaining] = useState([]);
  const [score,setScore] = useState(0);
  const {username} = useParams();
  const navigate = useNavigate()

  const handleRollDice = (playerIndex, rolls) => {
    if (rollsRemaining[playerIndex] === 0) {
      return false;
    }else{
      const updatedScores = [...playerScores];
      updatedScores[playerIndex] = rolls;
      setPlayerScores(updatedScores);
      const updatedRollsRemaining = [...rollsRemaining];
      updatedRollsRemaining[playerIndex] -= 1;
      setRollsRemaining(updatedRollsRemaining);
    }

  };
  const calculateScore = (rolls) => {
    return rolls.reduce((sum, roll) => sum + roll, 0);
  };
  const determineWinner = async () => {
    const scores = playerScores.map(rolls => calculateScore(rolls));
    if(Math.max(...scores)>0){
      const maxIndex = scores.indexOf(Math.max(...scores));
      setScore(Math.max(...scores));
      setWinnerPlayer(maxIndex + 1);
      let newScores={score:(Math.max(...scores)),winnerPlayer:(maxIndex + 1)}
      const response = await fetch('http://localhost:3000/savescore', {
        method: 'POST',
        headers:{
          "Content-Type":"application/json"
        },
        credentials: 'include',
        body: JSON.stringify(newScores)
      });
      if (response.ok){
        alert("Save Data successfull");
      }
    }
  };

  const reset = () => {
    setPlayerScores([]);
    setNumPlayers('');
    setSubmitted(false);
    setWinnerPlayer(0);
  };
  const handleSubmit = () => {
    if (numPlayers === '' || isNaN(numPlayers) || parseInt(numPlayers) < 1) {
      alert('Please enter a valid number of players');
    } else {
      setPlayerScores(Array.from({ length: parseInt(numPlayers) }, () => []));
      setRollsRemaining(Array.from({ length: parseInt(numPlayers) }, () => 5));
      setSubmitted(true);

    }
  };
  const redirectScore = () => {
    //console.log("hiii");
    navigate(`/score`);
  }
  const myStyle = {
    color: "black",
    padding: "10px",
    fontFamily: "Sans-Serif",
    width:"100%"
  };
  return (
    <div style={myStyle}>
      <h1>Poker Game with Dice</h1>

        <div>
          <label>Number of Players: </label>
          <input type="number" min="1" value={numPlayers} onChange={(e) => setNumPlayers(e.target.value)} />
          <button onClick={handleSubmit}>Submit</button>
        </div>

      {submitted && (
        <div>
          {[...Array(parseInt(numPlayers))].map((_, index) => (
            <PokerPlayer key={index} playerIndex={index} onRollDice={handleRollDice} onLimit={rollsRemaining} />
          ))}
          {numPlayers > 0 && (
          <button onClick={determineWinner} style={{ padding: '5px 10px', margin: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Determine Winner</button>


          )
           }
           <button onClick={() => setShowRules(!showRules)} style={{ padding: '5px 10px', margin: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {showRules ? 'Hide Rules' : 'Show Rules'}
          </button>
          <button onClick={redirectScore} style={{ padding: '5px 10px', margin: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Scores</button>
          {showRules && (
            <div style={{ marginTop: '20px' }}>
              <h3>Rules:</h3>
              <p>Each player gets 5 chances to roll the die and their score is recorded for each roll.</p>
              <p>The winner is determined based on the highest total score after 5 rolls.</p>
            </div>
          )}
          { parseInt(winnerPlayer) > 0 && (
            <b style={{ fontWeight: 'bold', marginTop: '10px 10PX' }}>Winner is Player {winnerPlayer}</b>)}
            <button onClick={reset} style={{ padding: '5px 10px', margin: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reset</button>
        </div>
      )}
    </div>
  );

};

export default NewPage;
