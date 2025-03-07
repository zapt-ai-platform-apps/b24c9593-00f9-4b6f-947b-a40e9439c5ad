import React from 'react';
import useGameState from '../../hooks/useGameState';

export default function GameOverScreen({ onRestart }) {
  const { score, hiScore } = useGameState();
  const isNewHighScore = score > hiScore - 1; // Account for potential floating point imprecision
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full pointer-events-auto">
      <div className="bg-black bg-opacity-70 p-8 rounded-lg text-center max-w-sm">
        <h1 className="text-4xl font-bold text-white mb-4">Game Over!</h1>
        
        {isNewHighScore && (
          <div className="mb-4">
            <p className="text-yellow-300 text-xl font-bold">New High Score!</p>
          </div>
        )}
        
        <p className="text-white text-xl mb-2">Score: {Math.floor(score)}</p>
        <p className="text-white text-xl mb-8">High Score: {Math.floor(hiScore)}</p>
        
        <button 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-xl cursor-pointer transition-colors"
          onClick={onRestart}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}