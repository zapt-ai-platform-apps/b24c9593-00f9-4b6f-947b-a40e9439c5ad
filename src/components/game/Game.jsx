import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import Character from './Character';
import Environment from './Environment';
import ObstacleSystem from './ObstacleSystem';
import { useKeyboard } from '../../hooks/useKeyboard';
import useGameState from '../../hooks/useGameState';

export default function Game({ gameState }) {
  const { moveLeft, moveRight, jump, slide } = useKeyboard();
  const { 
    increaseScore, 
    gameOver, 
    characterPosition,
    updateCharacterPosition,
    speed,
    increaseSpeed,
    updateJumpTime
  } = useGameState();
  
  const gameRef = useRef();
  
  useFrame((state, delta) => {
    if (gameState !== 'playing') return;
    
    // Update jump animation
    updateJumpTime(delta);
    
    // Increase score based on frame time
    increaseScore(delta * speed);
    
    // Gradually increase speed over time
    increaseSpeed(delta);
  });
  
  useEffect(() => {
    const handleTouch = (e) => {
      const { clientX } = e.touches[0];
      const windowWidth = window.innerWidth;
      
      // Left third of screen: move left
      if (clientX < windowWidth / 3) {
        moveLeft();
      } 
      // Right third of screen: move right
      else if (clientX > (windowWidth * 2) / 3) {
        moveRight();
      } 
      // Middle: jump
      else {
        jump();
      }
    };
    
    let touchStartY = 0;
    
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchEndY - touchStartY;
      
      // Swipe up
      if (deltaY < -50) {
        jump();
      }
      // Swipe down
      else if (deltaY > 50) {
        slide();
      }
    };
    
    // Add touch controls for mobile
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    console.log('Game initialized with speed:', speed);
    
    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [moveLeft, moveRight, jump, slide, speed]);
  
  return (
    <group ref={gameRef}>
      <Character 
        position={characterPosition}
        isJumping={characterPosition.jumping}
        isSliding={characterPosition.sliding}
      />
      <Environment speed={speed} />
      <ObstacleSystem 
        speed={speed}
        characterPosition={characterPosition}
        onCollision={gameOver}
      />
    </group>
  );
}