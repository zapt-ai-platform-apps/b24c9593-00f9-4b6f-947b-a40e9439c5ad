import React from 'react';
import useGameState from '../../hooks/useGameState';

export default function HUD() {
  const { score, hiScore, speed } = useGameState();
  
  return (
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none">
      <div className="flex justify-between items-center">
        <div className="bg-black bg-opacity-70 p-2 rounded">
          <p className="text-white font-bold">Score: {Math.floor(score)}</p>
        </div>
        
        <div className="bg-black bg-opacity-70 p-2 rounded">
          <p className="text-white text-sm">
            Speed: <span className="font-bold">{Math.floor(speed)}</span>
          </p>
        </div>
        
        <div className="bg-black bg-opacity-70 p-2 rounded">
          <p className="text-white font-bold">High Score: {Math.floor(hiScore)}</p>
        </div>
      </div>
    </div>
  );
}