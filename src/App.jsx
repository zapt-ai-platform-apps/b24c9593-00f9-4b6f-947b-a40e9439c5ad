import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, Environment } from '@react-three/drei';
import Game from './components/game/Game';
import MainMenu from './components/ui/MainMenu';
import HUD from './components/ui/HUD';
import GameOverScreen from './components/ui/GameOverScreen';
import useGameState from './hooks/useGameState';

export default function App() {
  const { gameState, startGame, restartGame } = useGameState();
  
  return (
    <div className="h-full w-full bg-gray-900 relative">
      {/* Game canvas */}
      <Canvas shadows className="w-full h-full absolute inset-0">
        <Sky sunPosition={[100, 20, 100]} />
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        
        {gameState !== 'menu' && <Game gameState={gameState} />}
      </Canvas>
      
      {/* UI Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {gameState === 'menu' && (
          <MainMenu onStart={startGame} />
        )}
        
        {gameState === 'playing' && (
          <HUD />
        )}
        
        {gameState === 'gameOver' && (
          <GameOverScreen onRestart={restartGame} />
        )}
      </div>
      
      {/* Made with ZAPT badge */}
      <a 
        href="https://www.zapt.ai" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 text-white text-sm px-2 py-1 bg-purple-600 rounded z-50"
      >
        Made on ZAPT
      </a>
    </div>
  );
}