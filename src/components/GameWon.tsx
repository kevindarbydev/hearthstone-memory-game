import React, { useState, useEffect } from "react";

interface GameWonProps {
  score: number;
  sentScore: boolean;
}

function GameWon({ score }: GameWonProps) {
  const [nameToSave, setNameToSave] = useState("");
  const [sentScore, setSentScore] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    setMoves(score);
  }, [score]);

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNameToSave(event.target.value);
  }

  function generateScoreKey(name: string) {
    const timestamp = new Date().getTime(); // Get Unix timestamp in milliseconds
    return `${name}-${timestamp}`;
  }

  const API_URL = process.env.NODE_API_URL;

  function handleSaveScore(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const scoreKey = generateScoreKey(nameToSave);

    const data = {
      scoreKey: scoreKey,
      name: nameToSave,
      count: moves,
    };

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };    

    try {
      fetch(
        API_URL + "saveScore",
        requestOptions
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response failed");
          }
          return response.json();
        })
        .then(() => {
          setSentScore(true);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div>
      <div>
        <p>Congratulations! You've matched all tiles!</p>
        <p>
          You can enter your name or a nickname to have your score sent and
          saved to the leaderboard.
        </p>
      </div>
      <form>
        {!sentScore && (
          <div>
            <label htmlFor="name">Name or Nickname: </label>
            <input
              type="text"
              id="name"
              name="name"
              value={nameToSave}
              onChange={handleNameChange}
            />
            <button className="btn" onClick={handleSaveScore}>
              Send Score
            </button>
          </div>
        )}
        <br />
      </form>
    </div>
  );
}

export default GameWon;
