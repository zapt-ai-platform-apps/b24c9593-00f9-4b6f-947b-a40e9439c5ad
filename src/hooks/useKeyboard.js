import { useEffect, useCallback } from 'react';
import useGameState from './useGameState';

export function useKeyboard() {
  const { 
    updateCharacterPosition, 
    characterPosition,
    gameState
  } = useGameState();
  
  const moveLeft = useCallback(() => {
    if (gameState !== 'playing' || characterPosition.lane <= -1) return;
    
    console.log('Moving left');
    updateCharacterPosition({
      ...characterPosition,
      previousLane: characterPosition.lane,
      lane: characterPosition.lane - 1
    });
  }, [characterPosition, updateCharacterPosition, gameState]);
  
  const moveRight = useCallback(() => {
    if (gameState !== 'playing' || characterPosition.lane >= 1) return;
    
    console.log('Moving right');
    updateCharacterPosition({
      ...characterPosition,
      previousLane: characterPosition.lane,
      lane: characterPosition.lane + 1
    });
  }, [characterPosition, updateCharacterPosition, gameState]);
  
  const jump = useCallback(() => {
    if (gameState !== 'playing' || characterPosition.jumping || characterPosition.sliding) return;
    
    console.log('Jumping');
    updateCharacterPosition({
      ...characterPosition,
      jumping: true,
      jumpTime: 0,
      jumpDuration: 0.5 // in seconds
    });
  }, [characterPosition, updateCharacterPosition, gameState]);
  
  const slide = useCallback(() => {
    if (gameState !== 'playing' || characterPosition.sliding || characterPosition.jumping) return;
    
    console.log('Sliding');
    updateCharacterPosition({
      ...characterPosition,
      sliding: true
    });
    
    // Reset slide after duration
    setTimeout(() => {
      if (gameState === 'playing') {
        updateCharacterPosition({
          ...characterPosition,
          sliding: false
        });
      }
    }, 1000); // 1 second slide
  }, [characterPosition, updateCharacterPosition, gameState]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        case 'ArrowUp':
        case ' ': // Space bar
          jump();
          break;
        case 'ArrowDown':
          slide();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [moveLeft, moveRight, jump, slide]);
  
  return { moveLeft, moveRight, jump, slide };
}