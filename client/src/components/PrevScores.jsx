import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button } from "../styled/Button";


const PrevScores = ()=>{

    const navigate = useNavigate();
    const [prevScores, setPrevScores] = useState([]);
    const {username} = useParams();
    useEffect(()=>{
        const fetchPrevScores = async () =>{
            try{
                const response = await fetch(`http://localhost:3000/prevscores`);
                if (response.ok){
                    const data = await response.json();
                    //console.log(data.prevScores);
                    setPrevScores(data.prevScores);
                }
                else{
                    console.error('Failed to fetch previous scores:',response.statusText);
                }
            }
            catch(err) {
                console.log("Fetch error", err.message)
            };
        }
        fetchPrevScores();
    }, [username]);

    const formatDateTime = (dateTimeString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
        return new Date(dateTimeString).toLocaleString(undefined, options);
      };

    const goBack = () =>{
      navigate(`/`);
    }

    return(
        <Container>
        <h2>Previous Scores</h2>
        <Table>
          <thead>
            <tr>
              <th>PlayerID</th>
              <th>Max Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>

            {prevScores.map((score, index) => (

              <tr key={index}>
                <td>{score.playerid}</td>
                <td>{score.score}</td>
                <td>{formatDateTime(score.date)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="button">
        <Button onClick={goBack}>
          Go Back
        </Button>
        </div>
      </Container>

    );
  };

  const Container = styled.div`
    padding: 20px;
    text-align: center;

  .button {
    margin-top: 15px;
  }
  `;

  const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;

    ;

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;

    }

    th {
      background-color: #120303;
      color: white;
    }
  `;




export default PrevScores;
