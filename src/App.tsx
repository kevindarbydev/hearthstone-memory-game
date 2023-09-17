import { MouseEventHandler, useState, useEffect } from "react";
import GameWon from "./components/GameWon";
import "./App.css";
import {
  DeathKnightImage,
  MageImage,
  WarlockImage,
  WarriorImage,
  RogueImage,
  ShamanImage,
  PaladinImage,
  PriestImage,
  BlankImage,
} from "./assets";
import HiScores from "./components/HiScores";

const images = [
  DeathKnightImage,
  MageImage,
  WarlockImage,
  WarriorImage,
  RogueImage,
  ShamanImage,
  PaladinImage,
  PriestImage,
  MageImage,
  DeathKnightImage,
  PriestImage,
  WarlockImage,
  ShamanImage,
  WarriorImage,
  RogueImage,
  PaladinImage,
];

interface Tile {
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
  rowIndex: number;
  colIndex: number;
}

function shuffleArray(array: string[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function App() {
  const [board, setBoard] = useState<Tile[][]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [clickedTile, setClickedTile] = useState<Tile | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [sentScore, setSentScore] = useState(false);
  const [showScores, setShowScores] = useState(false);

  const generateBoard = (images: string[]): Tile[][] => {
    setGameCompleted(false);
    const shuffledImages = shuffleArray(images);
    return Array.from({ length: 4 }, (_, rowIndex) =>
      shuffledImages
        .slice(rowIndex * 4, (rowIndex + 1) * 4)
        .map((image, colIndex) => ({
          image,
          isFlipped: false,
          isMatched: false,
          rowIndex,
          colIndex,
        }))
    );
  };
  useEffect(() => {
    const initialBoard = generateBoard(images);
    setBoard(initialBoard);
  }, []);

  const displayHiScores = (): void => {
    setShowScores(!showScores);
  };

  const handleReset = () => {
    const resetBoard = generateBoard(images);
    setBoard(resetBoard);
    setShowScores(false);
    setGameCompleted(false);
    setSentScore(false);
    setMoveCount(0);
  };

  const handleTileClick: MouseEventHandler<HTMLImageElement> = (event) => {
    const rowIndex = parseInt(
      event.currentTarget.getAttribute("data-row") || "0"
    );
    const colIndex = parseInt(
      event.currentTarget.getAttribute("data-col") || "0"
    );
    const clickedTileInfo = board[rowIndex][colIndex];

    if (!clickedTileInfo.isFlipped) {
      const updatedBoard = [...board];
      updatedBoard[rowIndex][colIndex].isFlipped = true;
      setBoard(updatedBoard);

      if (clickedTile) {
        setMoveCount((prevMoveCount) => prevMoveCount + 1);
        if (clickedTile.image === clickedTileInfo.image) {
          const matchedBoard = [...updatedBoard];
          matchedBoard[rowIndex][colIndex].isMatched = true;
          matchedBoard[clickedTile.rowIndex][clickedTile.colIndex].isMatched =
            true;
          setBoard(matchedBoard);

          const allTilesMatched = matchedBoard.every(
            (row) => row.every((tile) => tile.isMatched) // check if all tiles are matched
          );
          if (allTilesMatched) {
            setGameCompleted(true);
          }
        } else {
          const resetBoard = [...updatedBoard]; //no match, reset both tiles to blank after a delay
          setTimeout(() => {
            resetBoard[rowIndex][colIndex].isFlipped = false;
            resetBoard[clickedTile.rowIndex][clickedTile.colIndex].isFlipped =
              false;
            setBoard(resetBoard);
          }, 800);
        }
        setClickedTile(null); // clear the clickedTile after checking for a match
      } else {
        setClickedTile({ ...clickedTileInfo, rowIndex, colIndex }); // store the clickedTile for comparison
      }
    }
  };

  return (
    <div className="grid">
      <h2 className="title">Hearthstone Memory Game</h2>
      <h3 className="counter">Guesses: {moveCount}</h3>

      {!gameCompleted && !showScores && (
        <div>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((tile, colIndex) => (
                <img
                  key={colIndex}
                  src={
                    tile.isMatched
                      ? tile.image
                      : tile.isFlipped
                      ? tile.image
                      : BlankImage
                  }
                  alt={`Image ${rowIndex}-${colIndex}`}
                  className={`tile ${tile.isMatched ? "matched-tile" : ""}`}
                  onClick={handleTileClick}
                  data-row={rowIndex}
                  data-col={colIndex}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {showScores && <HiScores />}

      {gameCompleted && !showScores && !sentScore && (
        <GameWon score={moveCount} sentScore={sentScore} />
      )}

      <div className="bottom">
        <button onClick={handleReset} className="resetBtn">
          Reset
        </button>
        <br />
        <button className="hiscoreBtn" onClick={displayHiScores}>
          View {showScores ? "Board" : "HiScores"}
        </button>
      </div>
    </div>
  );
}

export default App;
