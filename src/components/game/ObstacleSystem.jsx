import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { checkCollision } from '../../utils/collisionDetection';

// Types of obstacles
const OBSTACLE_TYPES = {
  BARRIER: 'barrier',
  LOW_BARRIER: 'lowBarrier',
  COIN: 'coin'
};

// Random obstacle generator
function generateObstacle(zPosition) {
  const lane = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
  
  // Randomly choose obstacle type
  const types = Object.values(OBSTACLE_TYPES);
  const type = types[Math.floor(Math.random() * types.length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    position: new THREE.Vector3(lane * 2, type === OBSTACLE_TYPES.LOW_BARRIER ? 0.25 : 1, zPosition),
    type,
    active: true,
    collected: false
  };
}

export default function ObstacleSystem({ speed, characterPosition, onCollision }) {
  const obstacles = useRef([]);
  const obstacleGroup = useRef();
  const lastObstacleZ = useRef(-20);
  
  // Generate initial obstacles
  useEffect(() => {
    obstacles.current = [];
    
    // Place obstacles at regular intervals
    for (let z = -20; z >= -100; z -= 10) {
      obstacles.current.push(generateObstacle(z));
    }
    
    lastObstacleZ.current = -100;
    
    console.log('Obstacle system initialized with', obstacles.current.length, 'obstacles');
  }, []);
  
  useFrame((state, delta) => {
    // Move obstacles toward the player
    obstacles.current.forEach(obstacle => {
      if (!obstacle.active) return;
      
      obstacle.position.z += speed * delta;
      
      // Check for collision with the character
      if (obstacle.position.z > -2 && obstacle.position.z < 2) {
        if (checkCollision(characterPosition, obstacle)) {
          if (obstacle.type === OBSTACLE_TYPES.COIN) {
            if (!obstacle.collected) {
              obstacle.collected = true;
              console.log('Collected coin!');
            }
          } else {
            // Hit an obstacle
            console.log('Collision detected!');
            onCollision();
          }
        }
      }
      
      // Remove obstacles that are behind the player
      if (obstacle.position.z > 5) {
        obstacle.active = false;
      }
    });
    
    // Clean up inactive obstacles
    obstacles.current = obstacles.current.filter(o => o.active);
    
    // Generate new obstacles as needed
    if (lastObstacleZ.current + speed * delta > -100) {
      const newObstacle = generateObstacle(lastObstacleZ.current - 15);
      obstacles.current.push(newObstacle);
      lastObstacleZ.current -= 15;
    }
  });
  
  return (
    <group ref={obstacleGroup}>
      {obstacles.current.map(obstacle => (
        <Obstacle key={obstacle.id} obstacle={obstacle} />
      ))}
    </group>
  );
}

function Obstacle({ obstacle }) {
  if (obstacle.collected) return null;
  
  switch (obstacle.type) {
    case OBSTACLE_TYPES.BARRIER:
      return (
        <mesh position={obstacle.position} castShadow>
          <boxGeometry args={[1.5, 2, 0.5]} />
          <meshStandardMaterial color="red" />
        </mesh>
      );
    
    case OBSTACLE_TYPES.LOW_BARRIER:
      return (
        <mesh position={obstacle.position} castShadow>
          <boxGeometry args={[3, 0.5, 0.5]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      );
    
    case OBSTACLE_TYPES.COIN:
      return (
        <group position={obstacle.position}>
          <mesh castShadow rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
            <meshStandardMaterial color="gold" metalness={1} roughness={0.3} />
          </mesh>
        </group>
      );
      
    default:
      return null;
  }
}