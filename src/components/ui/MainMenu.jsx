import React from 'react';
import useGameState from '../../hooks/useGameState';

export default function MainMenu({ onStart }) {
  const { hiScore } = useGameState();
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full pointer-events-auto">
      <div className="bg-black bg-opacity-70 p-8 rounded-lg text-center max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Subway Runner</h1>
        <p className="text-white mb-8">
          An endless runner game inspired by Subway Surfers
        </p>
        
        {hiScore > 0 && (
          <p className="text-yellow-400 mb-4">High Score: {Math.floor(hiScore)}</p>
        )}
        
        <button 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-xl cursor-pointer transition-colors"
          onClick={onStart}
        >
          Play Now
        </button>
        
        <div className="mt-8 text-white text-sm">
          <p className="mb-2 font-bold">Controls:</p>
          <p className="mb-1">⬅️ ➡️ Arrow keys to move left/right</p>
          <p className="mb-1">⬆️ or Space to jump</p>
          <p className="mb-1">⬇️ to slide</p>
          <p className="mt-4 text-gray-300">On mobile: Tap left/right sides to move, swipe up to jump, swipe down to slide</p>
        </div>
      </div>
    </div>
  );
}