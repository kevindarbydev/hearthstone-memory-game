import { useState, useEffect } from "react";

interface Score {
  scoreKey: string;
  name: string;
  count: number;
}
function HiScores() {
  const [showScores, setShowScores] = useState(false);
  const [scores, setScores] = useState<Score[]>([]);
  const url = import.meta.env.VITE_URL;

   function capitalizeName(input: string) {
     
     const parts = input.split("-");
     if (parts.length > 0) {
       const name = parts[0];
       const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

       return capitalizedName;
     }
     return "";
   }
  
  const fetchScores = async () => {
    try {
      const response = await fetch(url + "/allScores");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // Assuming the response is an array of scores
      setScores(data);
    } catch (error) {
      console.error("Error fetching scores:", error);
    }
  };

  // Fetch scores when the component mounts
  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <div className="">
      <h2>Leaderboard</h2>
      <ul>
        {scores.map((score) => (
          <li key={score.scoreKey}>
            {capitalizeName(score.scoreKey)}: {score.count}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HiScores;
