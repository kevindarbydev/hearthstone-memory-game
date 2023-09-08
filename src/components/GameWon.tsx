import React, { useState } from "react";

function GameWon() {
  const [nameToSave, setNameToSave] = useState("");

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
     console.log("Received submission: " + nameToSave);
     console.log("Score Key: " + scoreKey);
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
          <label htmlFor="name">Name or Nickname:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={nameToSave}
            onChange={handleNameChange}
          />
        </div>
        <button className="resetBtn" onClick={handleSaveScore}>
          Send Score
        </button>

        <button className="resetBtn">View HiScores (not working yet)</button>
      </form>
    </div>
  );
}

export default GameWon;
