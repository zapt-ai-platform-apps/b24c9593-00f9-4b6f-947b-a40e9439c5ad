import { create } from 'zustand';

const useGameState = create((set, get) => ({
  gameState: 'menu', // 'menu', 'playing', 'gameOver'
  score: 0,
  hiScore: localStorage.getItem('hiScore') ? parseInt(localStorage.getItem('hiScore')) : 0,
  speed: 10,
  maxSpeed: 30,
  characterPosition: {
    lane: 0, // -1 (left), 0 (center), 1 (right)
    previousLane: 0,
    y: 1, // y position (affected by jumping/sliding)
    z: 0, // always 0 as the character doesn't move forward/backward
    jumping: false,
    jumpTime: 0,
    jumpDuration: 0.5,
    sliding: false
  },
  
  startGame: () => {
    console.log('Starting game');
    set({
      gameState: 'playing',
      score: 0,
      speed: 10,
      characterPosition: {
        lane: 0,
        previousLane: 0,
        y: 1,
        z: 0,
        jumping: false,
        jumpTime: 0,
        jumpDuration: 0.5,
        sliding: false
      }
    });
  },
  
  gameOver: () => {
    console.log('Game over');
    const currentScore = get().score;
    const currentHiScore = get().hiScore;
    
    // Update high score if needed
    if (currentScore > currentHiScore) {
      console.log('New high score:', Math.floor(currentScore));
      localStorage.setItem('hiScore', Math.floor(currentScore).toString());
      set({ hiScore: currentScore });
    }
    
    set({ gameState: 'gameOver' });
  },
  
  restartGame: () => {
    console.log('Restarting game');
    get().startGame();
  },
  
  increaseScore: (amount) => {
    set(state => ({ score: state.score + amount }));
  },
  
  increaseSpeed: (delta) => {
    set(state => ({
      speed: Math.min(state.speed + delta * 0.1, state.maxSpeed)
    }));
  },
  
  updateCharacterPosition: (newPosition) => {
    set({ characterPosition: newPosition });
  },
  
  updateJumpTime: (delta) => {
    const char = get().characterPosition;
    
    if (char.jumping) {
      const newJumpTime = char.jumpTime + delta;
      
      if (newJumpTime >= char.jumpDuration) {
        set({
          characterPosition: {
            ...char,
            jumping: false,
            jumpTime: 0
          }
        });
      } else {
        set({
          characterPosition: {
            ...char,
            jumpTime: newJumpTime
          }
        });
      }
    }
  }
}));

export default useGameState;