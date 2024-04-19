import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'

// Images for dice faces
const NewPage = () => {
  const {username} = useParams();
  const navigate = useNavigate();
  const [score,setScore] = useState(0);
  // Parse input string to extract scores of each player
  let plyerArr="[1, 2, 1, 1, 1] | [2, 2, 2, 3, 3] | [5, 2, 6, 1, 4]";
  const playerScores = plyerArr.split('|').map(player => JSON.parse(player.trim()));

  // State variables
  const [playercount, setPlayercount] = useState(false);
  const [rolling, setRolling] = useState(true);
  const [finalwinner, setFinalWinner] = useState(false);
  const [currentRolls, setCurrentRolls] = useState([]);

  const defualtRunRoll= (count) => {

    setRolling(true);
    const rolls = playerScores.map(player => {
      return Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
    });
    //console.log(rolls);
    setCurrentRolls(rolls);

    // Stop rolling after a delay and calculate the winner
    setTimeout(() => {
      setRolling(false);
    }, 1500); // Adjust the duration of rolling as needed
  };
  // Roll the dice when button is clicked
  const rollDice = (index) => {
    console.log(index);
    setRolling(true);
    // const rolls = playerScores.map(player => {
    //   return Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
    // });
    const rolls =playerScores[index].from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
    setCurrentRolls(rolls);

    // Stop rolling after a delay and calculate the winner
    setTimeout(() => {
      setRolling(false);
    }, 1500); // Adjust the duration of rolling as needed
  };

  // Calculate the score for a given set of rolls
  const calculateScore = (rolls) => {
    // Implement your scoring logic here
    // This is a simplified version using the sum of the rolls
    return rolls.reduce((sum, roll) => sum + roll, 0);
  };

  // Determine the winner based on the scores
  const determineWinner = () => {
    // Calculate scores for each player
    const scores = currentRolls.map(rolls => calculateScore(rolls));

    // Find the index of the player with the highest score
    const maxIndex = scores.indexOf(Math.max(...scores));
    //console.log(Math.max(...scores));


    // Determine the winner
    return `Winner is Player ${maxIndex + 1}`;
  };

  const logout = async() =>{
    try{
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        headers:{
          "Content-Type":"application/json"
        },
        credentials: 'include',
        body: JSON.stringify({username, score})
      });
      if (response.ok){
        console.log("logout successfull");
        navigate('/');
      }
      else {
        console.error('Logout failed:', response.status, response.statusText);
        // Handle error or provide user feedback
      }
    }
    catch (error) {
      console.error('Logout failed:', error.message);
    }
  };


  // Get the winner
  //const winner = determineWinner();


  return (
    <div>
    <div className="d-flex justify-content-center mt-3 login_container">
              <button onClick={logout} name="button" className="btn login_btn">Logout</button>
    </div>
    <div className="d-flex justify-content-center mt-3 login_container">

              <input type="text" onChange={defualtRunRoll}/>
    </div>
      <h1>Poker Game with Dice</h1>
      <div>
        <h2>Player Scores:</h2>
        {currentRolls.map((player, index) => (
          <p key={index}>Player {index + 1}: {player.join(', ')}</p>
        ))}
      </div>

      <NumberSelectorContainer>
      <div style={{"align-items":"left !important"}}>
        {currentRolls.map((rolls, index) => (
          <div key={index}>
          <button onClick={() => rollDice(index)} disabled={rolling}>Roll Dice</button>
            <h2>Player {index + 1}'s Rolls:</h2>
            <div>
              {rolling ? (
                <img src={`/images/vite.svg`} alt="Rolling" />
              ) : (
                rolls.map((roll, i) => (
                  <img loading="eager" style={{"left":"10px","position":"inherit","margin":"0 10px","width":"10%"}} class="rollimg" key={i} src={`/images/dice${roll}.png`} alt={`Die ${roll}`} />
                ))

              )}
            </div>
            <p key={index}>Player {index + 1}: {rolls.reduce((prv,nxt)=>prv+nxt,0)}</p>

          </div>

        ))}
      </div>
      </NumberSelectorContainer>
      <h2>{finalwinner}</h2>

    </div>

  );
};

export default NewPage;

const NumberSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  padding-right: 10px

  .rollimg {
    width:10%
  }
`;
