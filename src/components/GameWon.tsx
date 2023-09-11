import React, { useState } from "react";

function GameWon() {
  const [nameToSave, setNameToSave] = useState("");
  const url = import.meta.env.VITE_URL;

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNameToSave(event.target.value);
  }

  function generateScoreKey(name: string) {
    const timestamp = new Date().getTime(); // Get Unix timestamp in milliseconds
    return `${name}-${timestamp}`;
  }

  function handleSaveScore(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const scoreKey = generateScoreKey(nameToSave);

    const data = {
      scoreKey: scoreKey,
      name: nameToSave,
    };

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), 
    };

    try {      
      fetch(url + "/saveScore", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((responseData) => {       
          console.log("Score saved successfully:", responseData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <div className="popup">
      <div className="popup-text">
        <p>Congratulations! You've matched all tiles!</p>
        <p>
          You can enter your name or a nickname to have your score sent and
          saved to the leaderboard.
        </p>
      </div>
      <form>
        <div className="submit-score">
          <label htmlFor="name">Name or Nickname: </label>
          <input
            type="text"
            id="name"
            name="name"
            value={nameToSave}
            onChange={handleNameChange}
          />
          <button className="saveBtn" onClick={handleSaveScore}>
            Send Score
          </button>
        </div>
        <br />

        <button className="hiscoreBtn">View HiScores</button>
      </form>
    </div>
  );
}

export default GameWon;
