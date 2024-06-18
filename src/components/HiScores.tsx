import { useState, useEffect } from "react";
import "../App.css";
interface Score {
  SCOREKEY: string;
  name: string;
  count: number;
}

function HiScores() {
  const [scores, setScores] = useState<Score[]>([]);

  function capitalizeName(input: string) {
    const parts = input.split("-");
    if (parts.length > 0) {
      const name = parts[0];
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

      return capitalizedName;
    }
    return "";
  }

  const API_URL = process.env.NODE_API_URL;
  
  const fetchScores = async () => {
    try {
      const response = await fetch(
        API_URL + "/allScores"
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const sortedData = data.slice().sort((a: { count: number; }, b: { count: number; }) => a.count - b.count);
      const limitedData = sortedData.slice(0, 10);
      setScores(limitedData);
    } catch (error) {
      console.error("Error fetching scores:", error);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <>
      <h2>Leaderboard</h2>
      <div className="hi-scores">
        <ol>
          {scores ? (
            scores.map((score) => (
              <li key={score.SCOREKEY}>
                {capitalizeName(score.SCOREKEY)}: {score.count}
              </li>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </ol>
      </div>
    </>
  );
}

export default HiScores;
