/* eslint-disable @typescript-eslint/no-unused-vars */
import { MouseEventHandler, useState, useEffect } from "react";
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
  TileComplete
} from "./assets";

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

  useEffect(() => {
    const shuffledImages = shuffleArray(images);
    const initialBoard: Tile[][] = Array.from({ length: 4 }, (_, rowIndex) =>
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
    setBoard(initialBoard);
  }, []);

 const handleTileClick: MouseEventHandler<HTMLImageElement> = (event) => {
   const rowIndex = parseInt(
     event.currentTarget.getAttribute("data-row") || "0"
   );
   const colIndex = parseInt(
     event.currentTarget.getAttribute("data-col") || "0"
   );

   const clickedTileInfo = board[rowIndex][colIndex];

   if (!clickedTileInfo.isFlipped) {
     // Flip the clicked tile
     const updatedBoard = [...board];
     updatedBoard[rowIndex][colIndex].isFlipped = true;
     setBoard(updatedBoard);

     if (clickedTile) {
      setMoveCount((prevMoveCount) => prevMoveCount + 1);
       // Check for a match
       if (clickedTile.image === clickedTileInfo.image) {
         const matchedBoard = [...updatedBoard];
         matchedBoard[rowIndex][colIndex].isMatched = true;
         matchedBoard[clickedTile.rowIndex][clickedTile.colIndex].isMatched =
           true;
         setBoard(matchedBoard);
       } else {
         // If no match, reset both tiles to BlankImage after a delay
         const resetBoard = [...updatedBoard];
         setTimeout(() => {
           resetBoard[rowIndex][colIndex].isFlipped = false;
           resetBoard[clickedTile.rowIndex][clickedTile.colIndex].isFlipped =
             false;
           setBoard(resetBoard);
         }, 1000);
       }
       // Clear the clickedTile after checking for a match
       setClickedTile(null);
     } else {
       // Store the clickedTile for comparison
       setClickedTile({ ...clickedTileInfo, rowIndex, colIndex });
     }
   }
 };


  return (
    <div className="grid">
      <h2 className="title">Hearthstone Memory Game</h2>
      <h3 className="counter">{moveCount}</h3>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((tile, colIndex) => (
            <img
              key={colIndex}
              src={
                tile.isMatched // Display green check mark for matched tiles
                  ? TileComplete
                  : tile.isFlipped // Display actual image if flipped
                  ? tile.image
                  : BlankImage
              }
              alt={`Image ${rowIndex}-${colIndex}`}
              className="tile"
              onClick={handleTileClick}
              data-row={rowIndex}
              data-col={colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
